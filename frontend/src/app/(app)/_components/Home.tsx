'use client';
import React from 'react';
import { Body, ChatBox, Intent } from './index';
import { Conversation, Text } from '_reusables';
import {
  CreateAMealPlanSVG,
  EducateMeSVG,
  LogHistorySVG,
  MealSuggestionSVG,
} from '../../_svgs';

/**
 * Homepage of the app when the user is logged in. Renders for route '/' by default.
 * Contains welcome message, Chatbox and the Intent for the user to choose manually.
 */
export const Home: React.FC = () => {
  return (
    <Body>
      <div className="h-full flex flex-col items-center justify-center relative sm:-top-10">
        <div className="flex flex-col justify-center items-center sm:mb-6 mb-4">
          <Text
            text="Hi Akshay, welcome back!"
            className="gradient sm:text-3xl text-lg flex flex-wrap font-[320] "
          />

          <Conversation
            text="How can I help with your diet today?"
            className="text-md sm:text-3xl text-stone-400 flex flex-wrap font-[310]"
            animationDuration={1}
            animationDelay={2}
            animationSteps={50}
          />
        </div>
        <ChatBox className="sm:mb-0" />
        <div className="flex flex-row justify-center gap-5 mt-5">
          <Intent
            className="text-emerald-500  fill-emerald-500 hover:bg-emerald-500"
            text="Add Meal"
          >
            <p></p>
          </Intent>
          <Intent
            className="text-indigo-500  fill-indigo-500 hover:bg-indigo-500"
            text="Health Analytics"
          >
            <p></p>
          </Intent>
          <button
            onClick={async () => {
              const response = await fetch('http://localhost:8000', {
                method: 'Get',
              });
              console.log(await response.json());
            }}
          >
            tesing backend
          </button>
        </div>

        {/* <div className="w-full flex justify-center items-start gap-2 sm:mt-6 flex-wrap">
          <Intent
            className="text-emerald-500  fill-emerald-500 hover:bg-emerald-500"
            text="Suggestion"
          >
            <MealSuggestionSVG />
          </Intent>
          <Intent
            className="text-indigo-500 fill-indigo-500 hover:bg-indigo-500"
            text="History"
          >
            <LogHistorySVG />
          </Intent>
          <Intent
            className="text-rose-500  fill-rose-500 hover:bg-rose-500"
            text="Learn"
          >
            <EducateMeSVG />
          </Intent>
          <Intent
            className="text-teal-500  fill-teal-500 hover:bg-teal-500"
            text="Plan"
          >
            <CreateAMealPlanSVG />
          </Intent>
        </div> */}
      </div>
    </Body>
  );
};

Home.displayName = 'Home';
