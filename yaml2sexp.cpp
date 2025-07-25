#include <iostream>
#include <string>
#include <vector>
#include <map>

using namespace std;

struct YAMLValue {
    enum Type { STR, INT, FLOAT, LIST, DICT } type;
    string strVal;
    double numVal;
    vector<YAMLValue> listVal;
    map<string, YAMLValue> dictVal;

    YAMLValue(string s) : type(STR), strVal(s) {}
    YAMLValue(int i) : type(INT), numVal(i) {}
    YAMLValue(double f) : type(FLOAT), numVal(f) {}
    YAMLValue(vector<YAMLValue> l) : type(LIST), listVal(l) {}
    YAMLValue(map<string, YAMLValue> d) : type(DICT), dictVal(d) {}
};

string escape(const string& s) {
    string out = "\"";
    for (char c : s) {
        if (c == '"') out += "\\\"";
        else out += c;
    }
    out += "\"";
    return out;
}

string to_sexp(const string& key, const YAMLValue& val) {
    switch (val.type) {
        case YAMLValue::STR:
            return "(yaml:" + key + " " + escape(val.strVal) + ")";
        case YAMLValue::INT:
            return "(yaml:" + key + " " + to_string((int)val.numVal) + ")";
        case YAMLValue::FLOAT:
            return "(yaml:" + key + " " + to_string(val.numVal) + ")";
        case YAMLValue::LIST: {
            string out = "(yaml:" + key;
            for (const auto& item : val.listVal)
                out += " " + to_sexp("item", item);
            out += ")";
            return out;
        }
        case YAMLValue::DICT: {
            string out = "(yaml:" + key;
            for (const auto& [k, v] : val.dictVal)
                out += " " + to_sexp(k, v);
            out += ")";
            return out;
        }
        default: return "";
    }
}

int main() {
    map<string, YAMLValue> yaml = {
        {"receipt", YAMLValue("Oz-Ware Purchase Invoice")},
        {"date", YAMLValue(map<string, YAMLValue>{
            {"year", YAMLValue(2012)},
            {"month", YAMLValue(8)},
            {"day", YAMLValue(6)}
        })},
        {"customer", YAMLValue(map<string, YAMLValue>{
            {"first_name", YAMLValue("Dorothy")},
            {"family_name", YAMLValue("Gale")}
        })},
        {"items", YAMLValue(vector<YAMLValue>{
            YAMLValue(map<string, YAMLValue>{
                {"part_no", YAMLValue("A4786")},
                {"descrip", YAMLValue("Water Bucket (Filled)")},
                {"price", YAMLValue(1.47)},
                {"quantity", YAMLValue(4)}
            }),
            YAMLValue(map<string, YAMLValue>{
                {"part_no", YAMLValue("E1628")},
                {"descrip", YAMLValue("High Heeled \"Ruby\" Slippers")},
                {"size", YAMLValue(8)},
                {"price", YAMLValue(133.7)},
                {"quantity", YAMLValue(1)}
            })
        })}
    };

    for (const auto& [k, v] : yaml) {
        if (k == "date") {
            cout << "(yaml:date (make-date 2012 08 06))" << endl;
        } else {
            cout << to_sexp(k, v) << endl;
        }
    }
    return 0;
}
