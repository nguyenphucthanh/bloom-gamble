import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const congrats = async (
  playerNames: string[],
  winner: string
): Promise<string | null> => {
  const request = `${playerNames.join(
    ", "
  )} chơi đánh bài. ${winner} vừa chiến thắng những người chơi còn lại. Hãy viết một câu chúc mừng thật kích động trong vòng 20 từ.`;

  const messages = [{ role: "user", content: request }];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  return response.choices[0].message.content;
};
