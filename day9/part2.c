#include <stdio.h>
#include <string.h>
#include <stdlib.h>

//#define TEST
#ifdef TEST
#define PLAYER_COUNT 30
#define LAST_MARBLE 5807
#else
#define PLAYER_COUNT 423
#define LAST_MARBLE 7194400
#endif

int main() {
    int* circle = (int*)malloc(sizeof(int) * (LAST_MARBLE + 3));
    if (circle == NULL)
        puts("oh no");
    int players[PLAYER_COUNT];
    for (int i = 0; i < PLAYER_COUNT; i++)
        players[i] = 0;
    int curMarbleI = 0;
    int count = 1;
    int curPlayer = 0;
    circle[0] = 0;

    for (int curMarble = 1; curMarble <= LAST_MARBLE; curMarble++) {
        if (curMarble % 23 > 0) {
            curMarbleI += 2;
            if (curMarbleI > count)
                curMarbleI -= count;
            memmove(circle + curMarbleI + 1, circle + curMarbleI, sizeof(int) * (count - curMarbleI));
            circle[curMarbleI] = curMarble;
            count++;
        }
        else {
            curMarbleI -= 7;
            if (curMarbleI < 0)
                curMarbleI += count;
            int removed = circle[curMarbleI];
            memmove(circle + curMarbleI, circle + curMarbleI + 1, sizeof(int) * (count - curMarbleI));
            count--;
            players[curPlayer] += curMarble + removed;
        }
        curPlayer = (curPlayer + 1) % PLAYER_COUNT;
    }

    int best = 0;
    for (int i = 0; i < PLAYER_COUNT; i++) {
        if (players[i] > players[best])
            best = i;
    }
    printf("%d\n", players[best]);
    return 0;
}
