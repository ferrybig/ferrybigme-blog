```blogoptions
project=ferrybig/snake
tags=javascript,html
date=2017-06-25T13:38:48+00:00Z
image=images/snakeai.png
```

# The ai of a Snake

How I made the Snake ai.
[![enter image description here][1]][1]

## Introduction

Creating an AI for snake is difficulty, you have to consider not bumping
against your own tail, choosing the best path to the food, and still being
careful not to get stuck inside a loop.

## Rules

After careful analyzing of the above contains, I decided up the following
simple set of rules to tackle this problem:

*   On an even x coordinate, it may NOT move down (low priority)
*   On an odd x coordinate, it may NOT move up (low priority)
*   On an even y coordinate, it may NOT move left (low priority)
*   On an odd y coordinate, it may NOT move right (low priority)
*   The AI should avoid going thru walls (medium priority)
*   After committing a move, it may not intersect with itself (high priority)

These rules are resolved when trying to move, and usually, no rules will be
broken during the move progress. If these rules are put into code, it will look
like this:

```javascript
directions.up.distance =
        ((Snake.getX() % 2 === 0) ? 1 : 0)
        + (Board.isInBoard(Snake.getX(), Snake.getY() - 1) ? 2 : 0)
        + ((Board.getTile(Snake.getX(), Snake.getY() - 1) !== "snake") ? 4 : 0);
directions.down.distance =
        ((Snake.getX() % 2 === 1) ? 1 : 0)
        + (Board.isInBoard(Snake.getX(), Snake.getY() + 1) ? 2 : 0)
        + ((Board.getTile(Snake.getX(), Snake.getY() + 1) !== "snake") ? 4 : 0);
directions.left.distance =
        ((Snake.getY() % 2 === 1) ? 1 : 0)
        + (Board.isInBoard(Snake.getX() - 1, Snake.getY()) ? 2 : 0)
        + ((Board.getTile(Snake.getX() - 1, Snake.getY()) !== "snake") ? 4 : 0);
directions.rigth.distance =
        ((Snake.getY() % 2 === 0) ? 1 : 0)
        + (Board.isInBoard(Snake.getX() + 1, Snake.getY()) ? 2 : 0)
        + ((Board.getTile(Snake.getX() + 1, Snake.getY()) !== "snake") ? 4 : 0);
```

As you can see, there are rules to prevent the AI from moving through the
walls, even though the actual implementation of the snake game supports this.
This is because moving through the walls changes the calculation of closest
food tile, what is being used in the next step.

After resolving the above rules, we basicly have a number for every direction.
We make a list of the directions that have the higest number, if this list only
has 1 direction, we go towards that direction, else we use the formula of
triangles to calculate what direction would be the best. 

## Drawbacks

While these steps usually give the correct result, there are moments where
these steps fail, they are not accounted for in the code. For example:

*   a few unlucky food spans in a row can cause the tail to stop, while the face
    is closing in, this is usually the cause of the death in last few moments,
    where there aren't much empty tiles left.

*   Path finding may not be optional, because the snake only looks ahead 1 tile,
    while its grid is based a 2 tile rows, causing weird decisions when near
    certain food and snake patterns.

[1]: images/snakeai.png
