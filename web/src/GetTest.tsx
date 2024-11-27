// src/pages/GetTest.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { getTestById, startTest } from '@/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BiArrowBack, BiGroup, BiMenuAltLeft, BiTime } from 'react-icons/bi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@/components/ui/form';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface GetTestProps {
  testId: string;
  goToHome: () => void;
  goToLogin: () => void;
}

const GetTest: React.FC<GetTestProps> = ({ testId, goToHome, goToLogin }) => {
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await getTestById(testId);
        setTest(response.data.test);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch test details");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleStartTest = async () => {
    try {
      const requestData = { testId, username: username || null };
      console.log(requestData);
      const response = await startTest(requestData);
      //TODO: Redirect to test page
      alert('Test started successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to start test');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!test) {
    return <div>Test not found</div>;
  }

  const jwtToken = localStorage.getItem('jwtToken');
  const storedUsername = localStorage.getItem('username');

  return (
    <div className="min-h-screen w-full p-8 text-primary">
      <div className="absolute top-4 left-4 p-2 rounded-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={goToHome}>
              <BiArrowBack size={24} className="text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="absolute top-4 right-4 p-2 rounded-full">
        <Button onClick={goToLogin}>Login</Button>
      </div>
      <div className='w-full min-h-full mt-12 flex flex-col justify-center items-center'>
        <div className="w-full items-center rounded-lg overflow-hidden mb-4">
            <img src="https://picsum.photos/200" alt="photo" className="w-full max-h-[200px] object-cover" />
        </div>
        <h2 className="text-4xl text-primary font-bold mb-4 text-center">{test.testTitle}</h2>
        <div className="w-full md:w-[50%] grid grid-cols-3 gap-4 mb-4">
            <Card className="p-4 col-span-1 flex flex-col items-center">
                <BiTime size={48} className="text-primary mb-2" />
                <p>{test.testDuration} minutes</p>
            </Card>
            <Card className="p-4 col-span-1 flex flex-col items-center">
                <BiMenuAltLeft size={48} className="text-primary mb-2" />
                <p>{test.questionCount} Number</p>
            </Card>
            <Card className="p-4 col-span-1 flex flex-col items-center">
                <BiGroup size={48} className="text-primary mb-2" />
                <p>{test.UserTestCount} Users</p>
            </Card>
            {jwtToken && storedUsername && (
                <Card className="p-4 col-span-3">
                    <h3>{storedUsername}</h3>
                </Card>
            )}
        </div>
        <div className="w-full md:w-[50%]">
            <Form>
                {!jwtToken && (
                    <div className="mb-4">
                    <Input id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                )}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button type="button" className="w-full mb-4" onClick={() => setShowDialog(true)}>Start Test</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Confirm Start Test</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to start the test?
                    </DialogDescription>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setShowDialog(false)}>Cancel</Button>
                      <Button onClick={handleStartTest}>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </Form>
        </div>
      </div>
    </div>
  );
};

export default GetTest;