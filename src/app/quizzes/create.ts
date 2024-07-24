
"use server"
import { db } from "~/server/db";
import { quizzes, questions as Qschema, options } from '../../server/db/schema';
import { auth } from "~/auth";

interface Option {
    text: string;
    isCorrect: boolean;
  }
  
  interface Question {
    text: string;
    options: Option[];
  }
  
  interface Quiz {
    title: string;
    questions: Question[];
  }


export const createQuizServer= async (quiz:Quiz) => {
    const session=await auth();
    if(session?.user){
        console.log(quiz)
     
        try{
           const {title,questions}=quiz;
           console.log(title)
           console.log(questions)
           const newQuiz = await db.insert(quizzes).values({ title:title,creatorId : session.user.id }).returning();
           const quizID = newQuiz[0]?.id;
       
           console.log("New Quiz ID:", quizID);
       
           if (!quizID) {
             throw new Error("Failed to create new quiz.");
           }
       
           for (const question of questions) {
             const newQuestion = await db.insert(Qschema).values({ quizId: quizID, text: question.text }).returning();
             const questionId = newQuestion[0]?.id;
       
             console.log("New Question ID:", questionId);
       
             if (!questionId) {
               throw new Error("Failed to create new question.");
             }
       
             for (const option of question.options) {
               await db.insert(options).values({ questionId: questionId, text: option.text, isCorrect: option.isCorrect });
             }
           }
            }catch(err){
   
        }
    }else{
        console.log("Not authorized")
    }
    
     

}

