# meth
Node.js Configuration (Un)Management

## Overview
The goal of `meth` is to provide idempotent resource mutation primitives similar to those available in configuration management frameworks, but without all the extra 'management' tools.

### Goals
- Consistent and easy to follow execution
    - All commands are synchronous. This is for configuring computers, not serving billions of requests for your latest hipster web app.
    - Provide a minimum set of features and no more (to allow composition)
        - Templates, for example, are out of scope, as are 'attributes'
    - Errors should be caught as soon as possible. For example, arguments should be checked for validity and an exception thrown where the error has occured.
- Cross-Platform support. Initially, Arch Linux is targeted (pacman and systemd), but support for Windows (PowerShell, OneGet, etc), Debian/Ubuntu and RHEL/CentOS is planned.

If a full-stack CM system is desired, it should be able to build *on top* of `meth` as a seperate project, to add additional features like templating, attributes, script aggregation, etc.

## Implementation
Node.js is the only targeted execution platform. The code is written *without* transpilers, using the lastest ECMAScript features natively available.

When v1 is reached, semantic versioning will be in place, so execution engine compatibility changes will require a major version bump. The plan is to support each newest Node.js LTS release at that point.
