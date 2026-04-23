import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ResearcherAgent } from "./agents/researcher";
import { CriticAgent } from "./agents/critic";
import { ContentManagerAgent } from "./agents/content-manager";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * ShortSqueeze AI MCP Server
 * 에이전트들의 기능을 외부 AI 모델이 도구로 사용할 수 있도록 노출합니다.
 */
class ShortSqueezeMcpServer {
  private server: Server;
  private researcher: ResearcherAgent;
  private critic: CriticAgent;
  private contentManager: ContentManagerAgent;

  constructor() {
    this.server = new Server(
      {
        name: "shortsqueeze-ai-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.researcher = new ResearcherAgent();
    this.critic = new CriticAgent();
    this.contentManager = new ContentManagerAgent();

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupHandlers() {
    // 1. 사용 가능한 도구 목록 정의
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "analyze_stock",
          description: "특정 티커(Ticker)의 실시간 시장 데이터와 숏스퀴즈 가능성을 분석합니다.",
          inputSchema: {
            type: "object",
            properties: {
              ticker: { type: "string", description: "주식 티커 (예: CAR, GME)" },
              manualData: { type: "string", description: "추가 정보나 이전 피드백 (선택 사항)" },
            },
            required: ["ticker"],
          },
        },
        {
          name: "review_report",
          description: "리서치 리포트의 결함, 'The Wall' 원칙 부합 여부 및 대시보드 시각 상태를 검수합니다.",
          inputSchema: {
            type: "object",
            properties: {
              originalData: { type: "string", description: "분석에 사용된 원본 데이터" },
              researchReport: { type: "string", description: "검수할 리서치 리포트 내용" },
              dashboardUrl: { type: "string", description: "검수할 대시보드 URL (선택 사항)" },
            },
            required: ["originalData", "researchReport"],
          },
        },
        {
          name: "generate_script",
          description: "최종 승인된 리포트를 바탕으로 유튜브/방송용 대본을 생성합니다.",
          inputSchema: {
            type: "object",
            properties: {
              ticker: { type: "string", description: "주식 티커" },
              approvedReport: { type: "string", description: "승인된 최종 리포트 내용" },
            },
            required: ["ticker", "approvedReport"],
          },
        },
      ],
    }));

    // 2. 도구 호출 핸들러 실행
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "analyze_stock": {
            const { ticker, manualData } = args as { ticker: string; manualData?: string };
            const result = await this.researcher.analyzeStock(ticker, manualData);
            return { content: [{ type: "text", text: result || "분석 실패" }] };
          }
          case "review_report": {
            const { originalData, researchReport, dashboardUrl } = args as { 
              originalData: string; 
              researchReport: string; 
              dashboardUrl?: string 
            };
            const result = await this.critic.reviewReport(originalData, researchReport, dashboardUrl);
            return { content: [{ type: "text", text: result || "검수 실패" }] };
          }
          case "generate_script": {
            const { ticker, approvedReport } = args as { ticker: string; approvedReport: string };
            const result = await this.contentManager.generateScript(ticker, approvedReport);
            return { content: [{ type: "text", text: result || "대본 생성 실패" }] };
          }
          default:
            throw new Error(`지원하지 않는 도구입니다: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `에러 발생: ${error.message}` }],
          isError: true,
        };
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("ShortSqueeze AI MCP Server running on stdio");
  }
}

const server = new ShortSqueezeMcpServer();
server.run().catch(console.error);
