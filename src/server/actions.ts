"use server"

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { users,participants } from "./db/schema";

interface User {
  id: string | undefined | null;
  name: string | undefined | null;
  email: string | undefined | null;
  image: string | undefined | null;
}

export const getUserById = async (id: string) => {
    // const user = await db.select().from(users).where(eq(users.id, id));
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  
    return user;
};

export const insertUserLeaderboard = async ({ userInfo, score, quizId }: { userInfo: User; score: number; quizId: number }) => {
  try {
    console.log(`Inserting/updating leaderboard record for user ${userInfo.id} with score ${score}`);

    const existingParticipant = await db
      .select()
      .from(participants)
      .where(and(eq(participants.quizId, quizId), eq(participants.userId, userInfo.id)))
      .limit(1);
    console.log(existingParticipant,"new score = ",score);
    if (existingParticipant.length > 0) {
      await db
        .update(participants)
        .set({
          score,
          time: new Date(),
        })
        .where(and(eq(participants.quizId, quizId), eq(participants.userId, userInfo.id)));

      console.log("Participant record updated successfully.");
    } else {
      // Insert a new participant
      await db.insert(participants).values({
        quizId,
        userId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        image: userInfo.image,
        score,
        time: new Date(), // Set the current time
      });

      console.log("Participant record inserted successfully.");
    }
  } catch (err) {
    console.error("Error inserting/updating participant record:", err);
  }
};

export const generateLeaderBoard = async (quizId: number) => {
  try {

    const result = await db.query.participants.findMany({
      where: eq(participants.quizId, quizId),
      orderBy: (participants, { desc }) => [
        desc(participants.score), 
        desc(participants.time)  
      ],
      limit:10
    });

    return result;
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    throw err;
  }
};