import OpenAI from "openai";
const openai = new OpenAI();

export const congrats = async (
  playerNames: string[],
  winner: string
): Promise<string | null> => {
  const request = `${playerNames.join(
    ", "
  )} chơi đánh bài. ${winner} vừa chiến thắng những người chơi còn lại. Hãy viết một câu chúc mừng thật kích động trong vòng 20 từ.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: request,
      },
    ],
  });

  return response.choices[0].message.content;
};
