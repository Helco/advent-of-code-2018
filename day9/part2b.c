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

typedef struct dll {
    struct dll* prev, *next;
    int marble;
} dll;

dll* findNewNode(int* nextFreeNode, dll* nodes) {
    for (; *nextFreeNode <= LAST_MARBLE; (*nextFreeNode)++) {
        if (nodes[*nextFreeNode].next == NULL)
            return nodes + *nextFreeNode;
    }
    return NULL;
}

int main() {
    dll* nodes = (dll*)malloc(sizeof(dll) * (LAST_MARBLE + 1));
    memset(nodes, 0, sizeof(dll) * (LAST_MARBLE + 1));
    if (nodes == NULL)
        puts("oh no");
    long long players[PLAYER_COUNT];
    for (int i = 0; i < PLAYER_COUNT; i++)
        players[i] = 0;
    int curMarbleI = 0;
    int count = 1;
    int curPlayer = 0;
    int nextFreeNode = 1;
    dll* curNode = nodes;
    curNode->marble = 0;
    curNode->next = curNode;
    curNode->prev = curNode;

    for (int curMarble = 1; curMarble <= LAST_MARBLE; curMarble++) {
        if (curMarble % 23 > 0) {
            curNode = curNode->next;
            dll* newNode = findNewNode(&nextFreeNode, nodes);
            newNode->marble = curMarble;
            newNode->next = curNode->next;
            newNode->prev = curNode;
            curNode->next->prev = newNode;
            curNode->next = newNode;
            curNode = newNode;
        }
        else {
            for (int j = 0; j < 7; j++)
                curNode = curNode->prev;
            dll* removed = curNode;
            curNode = removed->next;
            removed->prev->next = removed->next;
            removed->next->prev = removed->prev;
            removed->next = removed->prev = NULL;
            players[curPlayer] += curMarble + removed->marble;
        }
        curPlayer = (curPlayer + 1) % PLAYER_COUNT;
    }

    int best = 0;
    for (int i = 0; i < PLAYER_COUNT; i++) {
        if (players[i] > players[best])
            best = i;
    }
    printf("%lld\n", players[best]);
    return 0;
}
