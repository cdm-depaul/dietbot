import { Button, Input } from '_reusables';
import Link from 'next/link';
import React from 'react';
const page = () => {
  return (
    <div className="flex flex-col w-full h-2/3  items-center">
      <span>Welcome</span>
      <span className="flex flex-col">
        <label className=" my-1">Password</label>
        <Input
          type="password"
          className="p-1 min-w-84 border-2 border-stone-400 rounded-xl w-full my-2 outline-none"
          placeholder=""
        />
      </span>
      <span className="flex flex-col">
        <label className=" my-1">Confirm Password</label>
        <Input
          type="password"
          className="p-1 min-w-84 border-2 border-stone-400 rounded-xl w-full my-2 outline-none"
          placeholder=""
        />
      </span>
      <span className="flex flex-col">
        <label className=" my-1">Age</label>
        <Input
          type="text"
          className="p-1 min-w-84 border-2 border-stone-400 rounded-xl w-full my-2 outline-none"
          placeholder=""
        />
      </span>
      <span className="flex flex-col">
        <label className=" my-1">Sex</label>
        <Input
          type="text"
          className="p-1 min-w-84 border-2 border-stone-400 rounded-xl w-full my-2 outline-none"
          placeholder=""
        />
      </span>
      <span className="flex flex-col">
        <label className=" my-1">Weight</label>
        <Input
          type="text"
          className="p-1 min-w-84 border-2 border-stone-400 rounded-xl w-full my-2 outline-none"
          placeholder=""
        />
      </span>
      <span className="flex flex-col">
        <label className=" my-1">Height</label>
        <Input
          type="text"
          className="p-1 min-w-84 border-2 border-stone-400 rounded-xl w-full my-2 outline-none"
          placeholder=""
        />
      </span>
      <Button className="my-4 border bg-blue-500 min-w-84 rounded-xl p-1">
        <span>Submit</span>
      </Button>
      <span>
        Already have an account ?{' '}
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </span>
    </div>
  );
};

export default page;
