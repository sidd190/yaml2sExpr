#include <iostream>
#include <sstream>
#include <string>
#include <yaml-cpp/yaml.h>
#include <regex>
using namespace std;

string escape_string(const string& s) {
    string out = "";
    for (char c : s) {
        if (c == '"') out += "\\\"";
        else out += c;
    }
    return out;
}

string to_symbol(const string& s) {
    // For part_no, output as 'A4786
    return "'" + s;
}

string to_make_date(const string& date_str) {
    // Expects YYYY-MM-DD
    regex date_regex(R"((\d{4})-(\d{2})-(\d{2}))");
    smatch match;
    if (regex_match(date_str, match, date_regex)) {
        return "(make-date " + match[1].str() + " " + match[2].str() + " " + match[3].str() + ")";
    }
    // fallback: just print as string
    return '"' + escape_string(date_str) + '"';
}

string to_sExpr_item(const YAML::Node& item) {
    ostringstream oss;
    oss << "(yaml:item";
    for (auto it = item.begin(); it != item.end(); ++it) {
        string key = it->first.as<string>();
        oss << " (yaml:" << key << " ";
        if (key == "part_no") {
            oss << to_symbol(it->second.as<string>());
        } else if (it->second.IsScalar()) {
            string val = it->second.as<string>();
            bool is_number = !val.empty() && (isdigit(val[0]) || val[0] == '-' || val[0] == '+');
            for (char c : val) {
                if (!isdigit(c) && c != '.' && c != '-' && c != '+') {
                    is_number = false;
                    break;
                }
            }
            if (is_number) oss << val;
            else oss << '"' << escape_string(val) << '"';
        } else {
            oss << to_sExpr_item(it->second);
        }
        oss << ")";
    }
    oss << ")";
    return oss.str();
}

string to_sexpr_map(const YAML::Node& node, const string& prefix = "yaml") {
    ostringstream oss;
    for (auto it = node.begin(); it != node.end(); ++it) {
        string key = it->first.as<string>();
        const YAML::Node& val = it->second;
        if (key == "date" && val.IsScalar()) {
            oss << "(" << prefix << ":date " << to_make_date(val.as<string>()) << ")\n";
        } else if (key == "items" && val.IsSequence()) {
            oss << "(" << prefix << ":items ";
            for (size_t i = 0; i < val.size(); ++i) {
                oss << to_sExpr_item(val[i]);
                if (i + 1 < val.size()) oss << " ";
            }
            oss << ")\n";
        } else if (val.IsMap()) {
            oss << "(" << prefix << ":" << key << " " << to_sexpr_map(val, prefix) << ")\n";
        } else if (val.IsScalar()) {
            string sval = val.as<string>();
            oss << "(" << prefix << ":" << key << " \"" << escape_string(sval) << "\")\n";
        } else if (val.IsSequence()) {
            // For any other sequence
            oss << "(" << prefix << ":" << key << " ";
            for (size_t i = 0; i < val.size(); ++i) {
                oss << to_sexpr_map(val[i], prefix);
                if (i + 1 < val.size()) oss << " ";
            }
            oss << ")\n";
        }
    }
    return oss.str();
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cerr << "Usage: " << argv[0] << " <input.yaml>\n";
        return 1;
    }
    try {
        YAML::Node root = YAML::LoadFile(argv[1]);
        cout << "(" << endl;
        cout << to_sexpr_map(root);
        cout << ")" << endl;
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    return 0;
} 