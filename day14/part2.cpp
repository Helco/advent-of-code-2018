#include <iostream>
#include <vector>
#include <string>

using namespace std;

#define ELV_COUNT 2

void evaluate(string search) {
    vector<int> recipes;
    recipes.push_back(3);
    recipes.push_back(7);
    int elves[ELV_COUNT] = { 0, 1 };

    int i;
    bool didFound = false;
    for (i = 0; !didFound; i++) {
        int newRecipes = recipes[elves[0]] + recipes[elves[1]];
        if (newRecipes > 9)
            recipes.push_back((newRecipes / 10) % 10);
        recipes.push_back(newRecipes % 10);

        elves[0] = (elves[0] + 1 + recipes[elves[0]]) % recipes.size();
        elves[1] = (elves[1] + 1 + recipes[elves[1]]) % recipes.size();

        //if ((newRecipes % 10) + '0' == search.at(search.length() - 1) && recipes.size() >= search.length()) {
        for (int k = 0; k < search.length() * 2; k++) {
            didFound = true;
            for (int j = 0; j < search.length(); j++) {
                if (recipes[recipes.size() - k - search.length() + j] != search[j] - '0') {
                    didFound = false;
                    break;
                }
            }
            if (didFound)
                cout << recipes.size() - search.length() - k << endl;
            if (didFound)
                break;
        }
        if (didFound)
            break;
        //}
    }
   // cout << recipes.size() - search.length() << endl;
}

int main(int argc, char* argv[]) {
    cout << "\nExpected: 9" << endl << "Actual:   ";
    evaluate("51589");

    cout << "\nExpected: 5" << endl << "Actual:   ";
    evaluate("01245");

    cout << "\nExpected: 18" << endl << "Actual:   ";
    evaluate("92510");

    cout << "\nExpected: 2018" << endl << "Actual:   ";
    evaluate("59414");

    cout << "\nExpected: 14" << endl << "Actual:   ";
    evaluate("167792");

    cout << endl;
    cout << "Solution: ";
    evaluate("380621");
    return 0;
}