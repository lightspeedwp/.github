# MSYS2 Reference

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

MSYS2 provides a collection of tools and libraries for building, installing, and running native Windows software. It uses Pacman (from Arch Linux) for package management.

## Getting Started

- [Getting Started](https://www.msys2.org/)
- [What is MSYS2?](https://www.msys2.org/docs/what-is-msys2/)
- [Who Is Using MSYS2?](https://www.msys2.org/docs/who-is-using-msys2/)
- [MSYS2 Installer](https://www.msys2.org/docs/installer/)
- [News](https://www.msys2.org/news/)
- [FAQ](https://www.msys2.org/docs/faq/)
- [Supported Windows Versions and Hardware](https://www.msys2.org/docs/windows_support/)
- [ARM64 Support](https://www.msys2.org/docs/arm64/)

## Environments

MSYS2 provides multiple environments targeting different use cases:

- [Environments Overview](https://www.msys2.org/docs/environments/)
- [GCC vs LLVM/Clang](https://www.msys2.org/docs/environments/#gcc-vs-llvmclang)
- [MSVCRT vs UCRT](https://www.msys2.org/docs/environments/#msvcrt-vs-ucrt)
- [Changelog](https://www.msys2.org/docs/environments/#changelog)

| Environment | Prefix | Toolchain | C Runtime |
|-------------|--------|-----------|-----------|
| MSYS | `/usr` | GCC | cygwin |
| MINGW64 | `/mingw64` | GCC | MSVCRT |
| UCRT64 | `/ucrt64` | GCC | UCRT |
| CLANG64 | `/clang64` | LLVM | UCRT |
| CLANGARM64 | `/clangarm64` | LLVM | UCRT |

## Configuration

- [Updating MSYS2](https://www.msys2.org/docs/updating/)
- [Filesystem Paths](https://www.msys2.org/docs/filesystem-paths/)
- [Symlinks](https://www.msys2.org/docs/symlinks/)
- [Configuration Locations](https://www.msys2.org/docs/configuration/)
- [Terminals](https://www.msys2.org/docs/terminals/)
- [IDEs and Text Editors](https://www.msys2.org/docs/ides-editors/)
- [Just-in-time Debugging](https://www.msys2.org/docs/jit-debugging/)

## Package Management

- [Package Management](https://www.msys2.org/docs/package-management/)
- [Package Naming](https://www.msys2.org/docs/package-naming/)
- [Package Index](https://packages.msys2.org/)
- [Repositories and Mirrors](https://www.msys2.org/docs/repos-mirrors/)
- [Package Mirrors](https://www.msys2.org/docs/mirrors/)
- [Tips and Tricks](https://www.msys2.org/docs/package-management-tips/)
- [FAQ](https://www.msys2.org/docs/package-management-faq/)
- [pacman](https://www.msys2.org/docs/pacman/)

## Development Tools

- [Using CMake in MSYS2](https://www.msys2.org/docs/cmake/)
- [Autotools](https://www.msys2.org/docs/autotools/)
- [Python](https://www.msys2.org/docs/python/)
- [Git](https://www.msys2.org/docs/git/)
- [C/C++](https://www.msys2.org/docs/c/)
- [C++](https://www.msys2.org/docs/cpp/)
- [pkg-config](https://www.msys2.org/docs/pkgconfig/)
- [Using MSYS2 in CI](https://www.msys2.org/docs/ci/)

## Package Development

- [Creating a new Package](https://www.msys2.org/dev/new-package/)
- [Updating an existing Package](https://www.msys2.org/dev/update-package/)
- [Package Guidelines](https://www.msys2.org/dev/package-guidelines/)
- [License Metadata](https://www.msys2.org/dev/package-licensing/)
- [PKGBUILD](https://www.msys2.org/dev/pkgbuild/)
- [Mirrors](https://www.msys2.org/dev/mirrors/)
- [MSYS2 Keyring](https://www.msys2.org/dev/keyring/)
- [Python](https://www.msys2.org/dev/python/)
- [Automated Build Process](https://www.msys2.org/dev/build-process/)
- [Vulnerability Reporting](https://www.msys2.org/dev/vulnerabilities/)
- [Accounts and Ownership](https://www.msys2.org/dev/accounts/)

## Wiki

- [Welcome to the MSYS2 wiki](https://www.msys2.org/wiki/Home/)
- [How does MSYS2 differ from Cygwin?](https://www.msys2.org/wiki/How-does-MSYS2-differ-from-Cygwin/)
- [MSYS2-Introduction](https://www.msys2.org/wiki/MSYS2-introduction/)
- [MSYS2 History](https://www.msys2.org/wiki/History/)
- [Creating Packages](https://www.msys2.org/wiki/Creating-Packages/)
- [Distributing](https://www.msys2.org/wiki/Distributing/)
- [Launchers](https://www.msys2.org/wiki/Launchers/)
- [Porting](https://www.msys2.org/wiki/Porting/)
- [Re-installing MSYS2](https://www.msys2.org/wiki/MSYS2-reinstallation/)
- [Setting up SSHd](https://www.msys2.org/wiki/Setting-up-SSHd/)
- [Signing Packages](https://www.msys2.org/wiki/Signing-packages/)
- [Do you need Sudo?](https://www.msys2.org/wiki/Sudo/)
- [Terminals](https://www.msys2.org/wiki/Terminals/)
- [Qt Creator](https://www.msys2.org/wiki/GDB-qtcreator/)
- [TODO LIST](https://www.msys2.org/wiki/Devtopics/)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
