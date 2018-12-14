#include <iostream>
#include <vector>

using namespace std;

#define ELV_COUNT 2

void evaluate(int count) {
    vector<int> recipes;
    recipes.push_back(3);
    recipes.push_back(7);
    int elves[ELV_COUNT] = { 0, 1 };

    for (int i = 0; i < count+10; i++) {
        int newRecipes = recipes[elves[0]] + recipes[elves[1]];
        if (newRecipes > 9)
            recipes.push_back((newRecipes / 10) % 10);
        recipes.push_back(newRecipes % 10);

        elves[0] = (elves[0] + 1 + recipes[elves[0]]) % recipes.size();
        elves[1] = (elves[1] + 1 + recipes[elves[1]]) % recipes.size();
    }

    for (int i = 0; i < 10; i++) {
        cout << recipes[(count + i) % recipes.size()];
    }
    cout << endl;
}

int main(int argc, char* argv[]) {
    cout << "\nExpected: 5158916779" << endl << "Actual:   ";
    evaluate(9);

    cout << "\nExpected: 0124515891" << endl << "Actual:   ";
    evaluate(5);

    cout << "\nExpected: 9251071085" << endl << "Actual:   ";
    evaluate(18);

    cout << "\nExpected: 5941429882" << endl << "Actual:   ";
    evaluate(2018);

    cout << endl;
    cout << "Solution: ";
    evaluate(380621);
    return 0;
}