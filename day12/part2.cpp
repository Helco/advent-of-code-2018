#include <vector>
#include <iostream>

using namespace std;

vector<bool> states[2] = {
    vector<bool>(),
    vector<bool>()
};
int origins[2] = {0, 0};
int curState = 0;

static const char* startState = "###..###....####.###...#..#...##...#..#....#.##.##.#..#.#..##.#####..######....#....##..#...#...#.#";
static const char* rules[] = {
    "..#.#",
    "##...",
    ".#...",
    "####.",
    ".##..",
    ".####",
    ".###.",
    "#####",
    "..#..",
    "###..",
    "#..##",
    "##.##",
    ".#..#",
    "#.#..",
    "#.###",
    "#.##.",
    ".#.##",
    "...#.",
    "..##.",
    "##.#.",
    NULL
};

void nextGeneration() {
    int prevState = curState;
    curState = !curState;
    states[curState].clear();
    origins[curState] = origins[prevState];
    //cout << curState << "," << prevState << "," << states[curState].size() << "," << states[prevState].size() << endl;
    const int ruleLength = 2;
    bool didFoundSomething = false;
    int f = states[prevState].size();
    for (int i = -ruleLength; i < f + ruleLength; i++) {
        bool foundRule = false;
        const char** rule = rules;
        while (*rule != NULL) {
            int j;
            for (j = -ruleLength; j <= ruleLength; j++) {
                bool prevCell = (i+j) >= 0 && (i+j) < f
                    ? states[prevState][i+j] : false;
                if (prevCell != ((*rule)[j + ruleLength] == '#'))
                    break;
            }
            if (j > ruleLength) {
                foundRule = true;
                break;
            }
            rule++;
        }
        if (foundRule) {
            states[curState].push_back(true);
            didFoundSomething = true;
            if (i < 0)
                origins[curState] = min(origins[curState], origins[prevState] + i);
        }
        else if (i >= 0 || didFoundSomething)
            states[curState].push_back(false);
    }
}

int64_t addPotNumbers() {
    int64_t result = 0;
    for (int i = 0; i < states[curState].size(); i++) {
        if (states[curState][i])
            result += i + origins[curState];
    }
    return result;
}

int main (int argc, char* argv[]) {
    const char* startChar = startState;
    while (*startChar != '\0') {
        states[curState].push_back(*startChar == '#');
        startChar++;
    }

    int64_t last = -1, cur = addPotNumbers();
    int64_t count = 0;
    while (cur != last && (cur - last) != 186) {
        last = cur;
        nextGeneration();
        cur = addPotNumbers();
        count++;
        cout << cur - last << endl;
    }
    cout << cur << " after " << count << endl;
    return 0;
}
