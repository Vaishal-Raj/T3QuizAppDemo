"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { quizCreationSchema } from '~/schemas/form/quiz'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../components/ui/card"
import {z} from 'zod';
 
import { Button } from "../components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { Input } from "../components/ui/input"
type Props = {}
type Input=z.infer<typeof quizCreationSchema>

const QuizCreation = (props: Props) => {
    const form=useForm<Input>({
        resolver:zodResolver(quizCreationSchema),
        defaultValues:{
            topic:"",
            amount:3,
            type:"mcq",
        }
    })
    // 2. Define a submit handler.
  function onSubmit(input:Input) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    
  }
  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Quiz Creation</CardTitle>
                <CardDescription>Choose a topic</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Enter a topic :" {...field} />
              </FormControl>
              <FormDescription>
                Provide a topic.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Enter number of questions :" 
                {...field}
                type="number"
                min={1}
                max={20}
                onChange={e=>{
                    form.setValue("amount",parseInt(e.target.value))
                }}
                 />
              </FormControl>
              <FormDescription>
                Provide a number less than 25.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
            </CardContent>
        </Card>

    </div>
  )
}

export default QuizCreation