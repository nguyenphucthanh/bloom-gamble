import { env } from "@/env";
import { MessageResponse, MessageService } from "./service-interface";

export type SlackResponse =
  | {
      ok: true;
      channel: string;
      ts: string;
    }
  | {
      ok: false;
      error?: string;
      warning?: string;
    };

export default class SlackMessage implements MessageService {
  token = env.SLACK_OAUTH_BOT_TOKEN;
  useWebHook = env.SLACK_USE_WEBHOOK;
  webHookUrl = env.SLACK_WEBHOOK;
  channel = env.SLACK_CHANNEL || "";

  async send(
    message: string,
    threadId?: string,
  ): Promise<MessageResponse> {
    try {
      const url =
        this.useWebHook && this.webHookUrl
          ? this.webHookUrl
          : this.token
            ? "https://slack.com/api/chat.postMessage"
            : "";

      if (!url) {
        return {
          success: false,
          error: "No webhook or slack bot setup",
        };
      }

      const data = {
        text: message,
        thread_ts: threadId,
      };

      const slackResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          ...(this.useWebHook
            ? {}
            : {
                Authorization: `Bearer ${this.token}`,
              }),
        },
        body: JSON.stringify({
          text: data?.text,
          ...(this.useWebHook
            ? {}
            : {
                channel: this.channel,
                thread_ts: data?.thread_ts,
              }),
        }),
      });

      if (this.useWebHook) {
        return {
          success: true,
          threadId: "",
          channel: this.channel,
        };
      } else {
        const response = (await slackResponse.json()) as SlackResponse;
        if (response.ok) {
          return {
            success: true,
            threadId: response.ts,
            channel: response.channel,
          };
        } else {
          return {
            success: false,
            error: response.error,
            warning: response.warning,
          };
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Cannot post message";

      return {
        success: false,
        error: msg,
      };
    }
  }
}
