import React from 'react';
import { Body, ChatBox, Intent } from './index';
import { Conversation, Text } from '../_reusables';
import {
  CreateAMealPlan,
  EducateMe,
  LogHistory,
  MealSuggestion,
} from '../_svgs';

export const Home = () => {
  return (
    <Body>
      <div className="h-full flex flex-col justify-center items-center">
        <span className="flex flex-col justify-center items-center sm:mb-6 mb-4">
          <Conversation
            text="Hi Akshay, welcome back!"
            className="gradient sm:text-3xl text-lg flex flex-wrap"
          />
          <Conversation
            text="How can I help you with your diet or nutrition today?"
            className="text-sm sm:text-2xl text-gray-400 flex flex-wrap"
            animationDuration={1}
            animationDelay={2}
            animationSteps={50}
          />
        </span>

        <ChatBox />
        <div className="w-full flex justify-center items-start gap-2 sm:mt-6 flex-wrap">
          <Intent className="border-green-500 text-green-500 fill-green-500">
            <MealSuggestion />
            <Text text="Suggestion" />
            {/* <Text text="Meal suggestion" /> */}
          </Intent>
          <Intent className="">
            <LogHistory />
            <Text text="History" />
            {/* <Text text="Log history" /> */}
          </Intent>
          <Intent className="">
            <EducateMe />
            <Text text="Learn" />
            {/* <Text text="Educate me" /> */}
          </Intent>
          <Intent className="">
            <CreateAMealPlan />
            <Text text="Plan" />
            {/* <Text text="Meal plan" /> */}
          </Intent>
          {/* <Intent className="">button</Intent> */}
        </div>
      </div>
    </Body>
  );
};
