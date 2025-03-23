import React from 'react';
import { Body, ChatBox, Intent } from './index';
import { Conversation, Text } from '../_reusables';
import {
  CreateAMealPlan,
  EducateMe,
  LogHistory,
  MealSuggestion,
} from '../_svgs';

/**
 * Homepage of the app when the user is logged in. Renders for route '/' by default.
 * Contains welcome message, Chatbox and the Intent for the user to choose manually.
 *
 */
export const Home: React.FC = () => {
  return (
    <Body>
      <div className="h-full flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center sm:mb-6 mb-4">
          <Text
            text="Hi Akshay, welcome back!"
            className="gradient sm:text-3xl text-lg flex flex-wrap font-light "
          />
          <Conversation
            text="How can I help with your diet today?"
            className="text-md sm:text-3xl text-stone-400 font-light flex flex-wrap"
            animationDuration={1}
            animationDelay={2}
            animationSteps={50}
          />
        </div>

        <ChatBox />
        <div className="w-full flex justify-center items-start gap-2 sm:mt-6 flex-wrap">
          <Intent
            className="text-emerald-500  fill-emerald-500 hover:bg-emerald-500"
            text="Suggestion"
          >
            <MealSuggestion />
            {/* <Text text="Meal suggestion" /> */}
          </Intent>
          <Intent
            className="text-indigo-500 fill-indigo-500 hover:bg-indigo-500"
            text="History"
          >
            <LogHistory />
            {/* <Text text="Log history" /> */}
          </Intent>
          <Intent
            className="text-rose-500  fill-rose-500 hover:bg-rose-500"
            text="Learn"
          >
            <EducateMe />
            {/* <Text text="Educate me" /> */}
          </Intent>
          <Intent
            className="text-teal-500  fill-teal-500 hover:bg-teal-500"
            text="Plan"
          >
            <CreateAMealPlan />
            {/* <Text text="Meal plan" /> */}
          </Intent>
          {/* <Intent className="">button</Intent> */}
        </div>
      </div>
    </Body>
  );
};

Home.displayName = 'Home';
