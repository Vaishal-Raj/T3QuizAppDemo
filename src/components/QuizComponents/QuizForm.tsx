"use client"

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { quizSchema } from '~/schemas/form/quiz';
import { createQuizServer } from '~/app/quizzes/create';
import { Button } from '../ui/button';
import { toast } from "sonner";
import { redirect } from 'next/navigation';

type QuizFormInputs = z.infer<typeof quizSchema>;

export default function QuizForm() {
  const [loading, setLoading] = useState(false);
  const { control, register, handleSubmit, formState: { errors } } = useForm<QuizFormInputs>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: [{ text: '', options: [{ text: '', isCorrect: false }] }],
    },
  });

  const { fields: questionFields, append: appendQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (quiz: QuizFormInputs) => {
    setLoading(true);
    try {
      console.log(quiz);
      await createQuizServer(quiz);
      toast("Quiz has been created.");
      redirect("/");
    } catch (error) {
      console.error('Failed to create quiz:', error);
      toast("Failed to create quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <div>
        <label htmlFor="title" className="block text-lg font-medium text-gray-700">Quiz Title</label>
        <input 
          id="title" 
          {...register('title')} 
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          placeholder="Enter quiz title"
        />
        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      
      {questionFields.map((question, qIndex) => (
        <div key={question.id} className="space-y-4">
          <label htmlFor={`questions.${qIndex}.text`} className="block text-lg font-medium text-gray-700">
            Question {qIndex + 1} Text
          </label>
          <input 
            id={`questions.${qIndex}.text`} 
            {...register(`questions.${qIndex}.text`)} 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            placeholder={`Enter text for question ${qIndex + 1}`}
          />
          {errors.questions?.[qIndex]?.text && <p className="mt-2 text-sm text-red-600">{errors.questions[qIndex].text?.message}</p>}
          
          <Controller
            control={control}
            name={`questions.${qIndex}.options`}
            render={({ field: { value, onChange } }) => (
              <div className="space-y-2">
                {value.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <input
                      id={`questions.${qIndex}.options.${optIndex}.text`}
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...value];
                        newOptions[optIndex].text = e.target.value;
                        onChange(newOptions);
                      }}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={`Option ${optIndex + 1} text`}
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={option.isCorrect}
                        onChange={(e) => {
                          const newOptions = value.map((opt, idx) => ({
                            ...opt,
                            isCorrect: idx === optIndex ? e.target.checked : false,
                          }));
                          onChange(newOptions);
                        }}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span>Correct</span>
                    </label>
                    {errors.questions?.[qIndex]?.options?.[optIndex]?.text && (
                      <p className="mt-2 text-sm text-red-600">{errors.questions[qIndex].options[optIndex].text?.message}</p>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => {
                    const newOptions = [...value, { text: '', isCorrect: false }];
                    onChange(newOptions);
                  }}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Option
                </button>
              </div>
            )}
          />
        </div>
      ))}
      
      <Button 
        type="button" 
        onClick={() => appendQuestion({ text: '', options: [{ text: '', isCorrect: false }] })}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Question
      </Button>
      <Button 
        type="submit"
        className="mt-4 mx-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Quiz'}
      </Button>
    </form>
  );
}
