cmake_minimum_required(VERSION 3.10)
project(sail_to_cgen)

set(CMAKE_CXX_STANDARD 17)

find_package(yaml-cpp REQUIRED)

add_executable(sail_to_cgen main.cpp)
target_link_libraries(sail_to_cgen yaml-cpp) 