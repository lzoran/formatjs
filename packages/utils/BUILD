load("@aspect_bazel_lib//lib:copy_to_bin.bzl", "copy_to_bin")
load("@aspect_bazel_lib//lib:write_source_files.bzl", "write_source_files")
load("@aspect_rules_js//npm:defs.bzl", "npm_package")
load("@npm//:defs.bzl", "npm_link_all_packages")
load("//tools:index.bzl", "generate_src_file", "package_json_test", "ts_compile")
load("//tools:jest.bzl", "jest_test_v2")

npm_link_all_packages()

exports_files([
    "package.json",
    "tsconfig.json",
])

PACKAGE_NAME = "utils"

npm_package(
    name = "pkg",
    srcs = [
        "LICENSE.md",
        "README.md",
        "package.json",
        ":dist",
        ":dist-esm",
    ],
    package = "@formatjs/%s" % PACKAGE_NAME,
    visibility = ["//visibility:public"],
)

SRCS = glob([
    "src/**/*",
    "*.ts",
])

SRC_DEPS = [
    ":node_modules/@formatjs/fast-memoize",
]

ts_compile(
    name = "dist",
    srcs = [":srcs"],
    skip_esm = False,
    deps = SRC_DEPS,
)

write_source_files(
    name = "tsconfig_json",
    files = {"tsconfig.json": "//tools:tsconfig.golden.json"},
)

package_json_test(
    name = "package_json_test",
    deps = SRC_DEPS,
)

jest_test_v2(
    name = "unit_test",
    srcs = [":dist"] + glob([
        "tests/*.ts*",
    ]),
    deps = SRC_DEPS,
)

generate_src_file(
    name = "default-currency",
    src = "src/defaultCurrencyData.generated.json",
    data = [
        "//:node_modules/cldr-core",
    ],
    entry_point = "tools/extract-default-currency.ts",
)

generate_src_file(
    name = "default-locale",
    src = "src/defaultLocaleData.generated.json",
    data = [
        "//:node_modules/cldr-core",
    ],
    entry_point = "tools/extract-default-locale.ts",
)

copy_to_bin(
    name = "srcs",
    srcs = SRCS,
)
