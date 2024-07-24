import { z } from "zod";

export const optionSchema = z.object({
  text: z.string().nonempty("Option text is required!!"),
  isCorrect: z.boolean().default(false),
});

export const questionSchema = z.object({
  text: z.string().nonempty("Question text is required!!"),
  options: z.array(optionSchema).min(2, "At least two options are required!!").refine(
    (options) => options.some(option => option.isCorrect),
    {
      message: "At least one option must be correct!!"
    }
  ),
});


export const quizSchema = z.object({
  title: z.string().nonempty("Quiz title is required"),
  questions: z.array(questionSchema).min(1, "At least one question is required!!"),
});
