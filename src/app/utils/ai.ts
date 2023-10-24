import OpenAI from "openai";
const openai = new OpenAI();

export const congrats = async (
  playerNames: string[],
  winner: string
): Promise<string | null> => {
  const random = Math.random() * 100;
  let demand = "";
  if (random >= 70) {
    demand =
      "Hãy viết một câu mang tính khinh thường 3 người chơi thua trong vòng 20 từ.";
  } else if (random >= 30) {
    demand =
      "Hãy viết một câu khiêu khích hết sức có thể 3 người chơi thua trong vòng 20 từ.";
  } else {
    demand = "Hãy viết một câu chúc mừng thật kích động trong vòng 20 từ.";
  }
  const request = `${playerNames.join(
    ", "
  )} chơi đánh bài. ${winner} vừa chiến thắng những người chơi còn lại. ${demand}`;

  try {
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
  } catch {
    return null;
  }
};
