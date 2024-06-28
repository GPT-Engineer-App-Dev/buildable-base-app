import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetchTopStories = async () => {
  const { data } = await axios.get(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyPromises = data.slice(0, 10).map(async (id) => {
    const story = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return story.data;
  });
  return Promise.all(storyPromises);
};

const HackerNews = () => {
  const { data, error, isLoading, refetch } = useQuery(["topStories"], fetchTopStories);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching stories</div>;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Top Hacker News Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {data.map((story) => (
              <li key={story.id}>
                <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {story.title}
                </a>
                <p className="text-gray-600">by {story.by}</p>
              </li>
            ))}
          </ul>
          <Button onClick={() => refetch()} className="w-full mt-4">Refresh</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HackerNews;