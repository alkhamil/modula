# MODULA 2.0

## Development & Revamp Specification

  Document                   Development Revamp Specification
  -------------------------- ------------------------------------
  Product                    Modula -- Modular Mockup Generator
  Version                    1.0
  Status                     Draft for Technical Assessment
  Approach                   Revamp Existing Application
  Account Model              Internal Account
  Code Generation Strategy   Fixed Company Base Code

------------------------------------------------------------------------

# 1. Overview

## 1.1 Background

Modula is an existing internal web application designed to accelerate
the creation of CMS mockups through reusable modules and standardized
components.

The existing application already provides a foundation that includes a
Design System, Component Library, CRUD Generator, Form Builder, Layout
Builder, Dynamic Module Renderer, and JSON-based Module Definition.

The next development phase focuses on improving the existing application
rather than rebuilding it from scratch. Modula 2.0 will evolve into an
internal productivity platform that helps teams visualize business
requirements, assemble interactive CMS mockups, and generate frontend
code that follows the company's standard project structure and coding
conventions.

The platform is intended to support Presales, Business Process Analysts
(BPA), UI/UX, Frontend Developers, and Quality Assurance (QA).

## 1.2 Vision

**Build Once, Reuse Everywhere, Deliver Faster.**

Make Modula the company's standard internal platform for creating CMS
mockups and generating a consistent starting point for application
development.

## 1.3 Objectives

1.  Help Presales create and present mockups independently without
    waiting for a separate UI/UX design process.
2.  Help BPA translate business requirements into clear, interactive
    application mockups.
3.  Help Frontend Developers reduce repetitive slicing by generating
    React source code that follows the company's standard base code.
4.  Help QA reduce repetitive testing of common components through
    standardized behavior and reusable test scenarios.
5.  Reduce mandays spent on repetitive and common implementation work.
6.  Maintain consistency across UI, UX, components, validation, and
    implementation between projects.
7.  Improve collaboration and shared understanding between business and
    technical teams.

## 1.4 Product Positioning

Modula 2.0 is an **internal Component-Based Mockup & Development
Generator**.

It is not intended to replace the responsibilities of Presales, BPA,
UI/UX, Developers, or QA. It aims to automate repetitive work so each
function can focus on analysis, business logic, design decisions,
integration, and project-specific testing.

------------------------------------------------------------------------

# 2. Product Principles

The following principles guide product and technical decisions.

## 2.1 Revamp, Not Rebuild

Existing capabilities must be assessed before implementation changes are
made. Reuse existing components, schemas, generators, and patterns
wherever they remain fit for purpose.

No existing feature should be rewritten without documenting the reason
and impact.

## 2.2 Component-Based Builder, Not Freeform Canvas

Modula uses a structured component-based builder. Users assemble pages
by dragging and arranging standardized components.

Modula is not a freeform design canvas like Figma or Canva. Layout,
spacing, responsive behavior, and component placement follow the
company's Design System and predefined layout rules.

## 2.3 Fixed Company Base Code

All generated React code must follow one fixed company base code
standard.

Users do not choose a framework, folder convention, coding style, or
Design System when exporting. These are centrally maintained by the
Modula development team.

## 2.4 Single Source of Truth

The Module Definition and related page/component configuration are the
canonical source for:

-   Interactive preview.
-   React source code generation.
-   Backend/API contract generation.
-   QA test scenario generation.

The preview and generated output must remain consistent with the same
definition.

## 2.5 Reusability and Standardization

Common components, patterns, validation rules, and interactions should
be implemented once and reused across projects.

## 2.6 Developer-Ready Output

Generated code should be a usable starting point inside the company's
standard project---not merely generic React markup. Developers should be
able to continue with business logic, API integration, and
project-specific requirements without repeating the slicing process.

------------------------------------------------------------------------

# 3. Existing Application Assessment

The repository and existing application are the starting point for the
revamp.

The following capabilities have been identified from the initial review
and discussion. Their implementation details, completeness, and code
quality must be verified through a source-code audit before finalizing
technical tasks.

  -----------------------------------------------------------------------
  Existing Capability                 Revamp Direction
  ----------------------------------- -----------------------------------
  Design System                       Keep, document, and improve

  Component Library                   Keep, extend, and standardize

  CRUD Generator / Wizard             Keep and enhance

  Form Builder                        Keep and enhance

  Layout Builder                      Evaluate and integrate as the main
                                      page-building experience

  Module Definition JSON              Keep and extend compatibly

  Dynamic Module Renderer             Keep and enhance

  Live Preview                        Improve into interactive prototype

  Bulk Upload / Export                Keep and evaluate

  Mock store / localStorage           Assess and replace or complement
                                      with persistent backend storage
                                      where required
  -----------------------------------------------------------------------

## 3.1 Required Existing-Code Audit

Before implementation, inspect and document:

1.  Current application architecture and folder structure.
2.  Existing Design System and component APIs.
3.  Current drag-and-drop implementation and supported layout rules.
4.  CRUD Generator and Form Builder capabilities.
5.  Module Definition schema, validation, and versioning.
6.  Dynamic renderer and preview behavior.
7.  Existing export/code-generation implementation, if any.
8.  Current data persistence and mock-store behavior.
9.  Existing authentication behavior and limitations.
10. Existing tests, build scripts, and development conventions.

Deliverable: an Existing Application Assessment containing feature
status, relevant source paths, reuse opportunities, technical gaps, and
migration risks.

------------------------------------------------------------------------

# 4. Target Product Capabilities

Modula 2.0 has four primary product capabilities:

1.  Component-Based Page Builder.
2.  Interactive Mockup & Prototype.
3.  Standardized React Code Generator.
4.  Backend Contract & QA Scenario Generator.

Supporting capabilities include internal authentication, user and
project management, collaboration, version history, and administration
of the component library.

------------------------------------------------------------------------

# 5. Authentication & User Management

## 5.1 Authentication Strategy

Modula uses **Internal Account Authentication**.

There is no public registration. Accounts are created or invited by
authorized administrators.

Initial requirements:

-   Login using email and password.
-   Logout.
-   Secure password hashing.
-   Session management and expiration.
-   Protected frontend routes.
-   Backend authentication middleware.
-   Login error handling.
-   Password reset or administrator-assisted reset.
-   Account activation and deactivation.
-   Rate limiting for login attempts.
-   Audit logging for relevant account activities.

Authentication and authorization must be enforced by the backend. Hiding
UI controls in the frontend is not sufficient security.

## 5.2 Initial Roles

  Role          Primary Responsibility
  ------------- ----------------------------------------------------------
  SUPER_ADMIN   Full system access and system administration
  ADMIN         User, project, component, and template administration
  PRESALES      Create, edit, preview, and present mockups
  BPA           Create and manage mockups based on business requirements
  UI_UX         Maintain design standards and component definitions
  DEVELOPER     Access project definitions and export generated code
  QA            Access mockups, validations, and QA scenarios

Roles are starting permission bundles. The authorization model should
support granular permissions such as `view`, `create`, `edit`, `delete`,
`export`, `share`, and `manage`.

## 5.3 User Management

Administrators with the appropriate permission can:

-   Create or invite users.
-   Edit user profile information.
-   Assign roles.
-   Activate or deactivate accounts.
-   Initiate password reset.
-   View relevant account activity.

Suggested user attributes:

-   User ID.
-   Full name.
-   Email.
-   Password hash.
-   Account status.
-   Assigned role(s).
-   Created at.
-   Updated at.
-   Last login.

Never store plaintext passwords.

------------------------------------------------------------------------

# 6. Project Management & Collaboration

## 6.1 Project Workspace

After login, users access a dashboard containing:

-   My Projects.
-   Shared Projects.
-   Recently Updated.
-   Project Templates.
-   Quick Create Project.

Each project should contain its metadata, pages, modules, component
configuration, definitions, and export history.

## 6.2 Project Ownership

Every project must have an owner.

Initial project access levels:

  Access Level   Capabilities
  -------------- --------------------------------------------------------------
  OWNER          Full project control, sharing, editing, deletion, and export
  EDITOR         Edit project configuration, pages, and modules
  VIEWER         View and preview project

Project permissions must be checked by the backend for every protected
operation.

## 6.3 Project Capabilities

-   Create project.
-   Edit project metadata.
-   Duplicate project.
-   Archive or delete project.
-   Share project with internal users.
-   Add and remove project members.
-   Change member access.
-   View project activity.
-   View and restore eligible versions.
-   Export project artifacts.

## 6.4 Project Data Isolation

Users must only access projects they own or have been granted access to.
Project ownership and membership must be enforced server-side.

------------------------------------------------------------------------

# 7. Component-Based Page Builder

## 7.1 Objective

Provide a visual editor that allows users to assemble CMS pages by
dragging standardized components from the Component Library into a
structured page layout.

## 7.2 Builder Layout

The builder consists of three primary areas.

### A. Component Library -- Left Panel

Displays available components grouped by category.

Initial component categories:

**Layout** - Container. - Row. - Column. - Card. - Tabs. - Divider. -
Grid or section layout.

**Navigation** - Breadcrumb. - Menu. - Page Header. - Pagination.

**Data Display** - Data Table. - Description List. - Statistic. - Badge
/ Status. - Empty State.

**Form** - Text Input. - Text Area. - Number Input. - Select. - Date
Picker. - Date Range. - Checkbox. - Radio. - Switch. - Upload.

**Action** - Button. - Dropdown Action. - Modal. - Confirmation Dialog.

**Feedback** - Alert. - Notification. - Loading State. - Error State.

**Business Components** - Approval Status. - Audit Information. - Common
CMS patterns approved by the company.

The actual component inventory must be aligned with the existing Design
System. The list above is a target catalogue, not a requirement to
duplicate components that already exist.

### B. Page Builder -- Center Panel

Users compose a page using structured drag-and-drop interactions.

Required capabilities:

-   Drag component from library to page.
-   Reorder components.
-   Nest components where allowed.
-   Select component.
-   Duplicate component.
-   Delete component.
-   Configure page layout.
-   Preview page.
-   Undo and redo.
-   Responsive preview.
-   Display component hierarchy or outline.
-   Validate invalid component placement.

The builder must enforce layout constraints and supported parent-child
relationships. It must not become an unrestricted pixel-positioning
editor.

### C. Properties Panel -- Right Panel

Displays configuration for the selected page or component.

Common properties:

-   Component name / identifier.
-   Label and title.
-   Visibility.
-   Layout and span.
-   Spacing options supported by the Design System.
-   Data binding.
-   Event/action configuration.
-   Empty, loading, and error states.

Component-specific properties must be provided through typed
configuration schemas.

## 7.3 Page Management

A project may contain multiple pages.

Initial page types:

-   List Page.
-   Create Page.
-   Edit Page.
-   Detail Page.
-   Dashboard Page.
-   Custom Page.

Users should be able to create, rename, duplicate, delete, and arrange
pages.

Page navigation and actions should be configurable so a mockup can
simulate realistic user journeys.

## 7.4 Builder Validation

The builder should validate:

-   Required component properties.
-   Unique identifiers.
-   Valid parent-child relationships.
-   Supported data bindings.
-   Valid action targets.
-   Valid page references.
-   Required form configuration.
-   Unsupported or deprecated component versions.

Validation errors should be actionable and displayed consistently.

------------------------------------------------------------------------

# 8. Interactive Mockup & Prototype

## 8.1 Objective

Make generated mockups usable for requirement validation and client
presentations, rather than static visual previews.

## 8.2 Interaction Requirements

Examples of supported interactions:

-   Clicking Create opens a create form or page.
-   Submitting a valid form updates mock data.
-   Invalid form submissions display validation messages.
-   Editing a record updates the mock dataset.
-   Deleting a record requires confirmation.
-   Search filters displayed records.
-   Sorting changes row order.
-   Pagination changes the displayed dataset.
-   Tabs switch content.
-   Modal and dropdown actions behave consistently.
-   Page navigation follows configured routes or prototype links.

## 8.3 Mock Data

The prototype should support configurable sample data.

Requirements:

-   Add, edit, and delete mock records.
-   Configure initial sample datasets.
-   Reset prototype data.
-   Support empty, loading, success, and error states.
-   Keep mock data separate from production backend data.

Prototype actions must not accidentally call production APIs.

## 8.4 Presentation Mode

Provide a presentation mode that hides builder controls and displays the
interactive mockup in a clean application-like experience.

Potential capabilities:

-   Full-screen preview.
-   Start from a selected page.
-   Navigate between configured pages.
-   Reset prototype data.
-   Share access through controlled internal project permissions.

External/public sharing is not part of the initial scope unless
separately approved.

------------------------------------------------------------------------

# 9. Module Definition & Configuration Schema

## 9.1 Core Principle

The existing JSON-based Module Definition should be retained and
extended rather than replaced without a migration plan.

It should act as the canonical configuration for rendering and
generation.

## 9.2 Target Definition Structure

The conceptual definition should support:

-   Schema version.
-   Project metadata.
-   Module metadata.
-   Pages.
-   Layout tree.
-   Components.
-   Component properties.
-   Data sources.
-   Form fields.
-   Validation rules.
-   Actions and interactions.
-   Navigation.
-   Permissions metadata where relevant.
-   Mock data configuration.

Illustrative structure:

``` json
{
  "schemaVersion": "2.0",
  "module": {
    "key": "customer",
    "name": "Customer Management"
  },
  "pages": [
    {
      "key": "customer-list",
      "type": "list",
      "title": "Customer",
      "components": [
        {
          "id": "customer-search",
          "type": "search",
          "props": {
            "placeholder": "Search customer"
          }
        },
        {
          "id": "customer-table",
          "type": "data-table",
          "props": {
            "dataSource": "customers"
          }
        }
      ]
    }
  ]
}
```

This is an illustrative target shape. It must be reconciled with the
actual existing `ModuleDefinition v1` schema before implementation.

## 9.3 Schema Governance

-   Validate definitions before saving and exporting.
-   Maintain explicit schema versions.
-   Provide migration support for older definitions.
-   Avoid breaking existing projects.
-   Use stable component identifiers and typed properties.
-   Define backward compatibility rules.
-   Reject unsupported schema versions with clear errors.

------------------------------------------------------------------------

# 10. Standardized React Code Generator

## 10.1 Objective

Generate native React source code that follows the company's fixed base
code project standard.

The goal is to provide a usable development starting point so Frontend
Developers can focus on business logic, API integration, and
project-specific customization instead of repeating common slicing work.

## 10.2 Fixed Base Code Strategy

Modula uses one centrally maintained company base code template.

Users cannot select arbitrary frameworks, styling systems, folder
structures, or coding conventions during export.

The generator must follow the approved company standards for:

-   Framework and language versions.
-   Folder and file structure.
-   Design System imports.
-   Component usage.
-   Naming conventions.
-   TypeScript conventions.
-   Routing.
-   State management.
-   API service patterns.
-   Form handling.
-   Validation.
-   Error handling.
-   Authorization integration where applicable.
-   Testing conventions.

The exact standards must be extracted from the company's actual base
code repository. Do not invent or assume folder structures and library
choices.

## 10.3 Generator Requirements

-   Generate React source code from the canonical Module Definition.
-   Reuse approved Design System components.
-   Generate page and component files according to base code
    conventions.
-   Generate types and interfaces.
-   Generate form configuration and validation where supported.
-   Generate table columns and actions.
-   Generate routing configuration where supported.
-   Generate service/API integration placeholders or adapters according
    to company conventions.
-   Generate consistent loading, empty, success, and error states.
-   Produce deterministic output for the same definition and generator
    version.
-   Validate generated output before packaging.
-   Provide a clear export report.

## 10.4 Output Structure

The exact generated folder structure must match the actual company base
code.

The following is only an illustration:

``` text
customer/
├── components/
│   ├── CustomerTable.tsx
│   ├── CustomerForm.tsx
│   └── CustomerFilter.tsx
├── hooks/
│   └── useCustomer.ts
├── services/
│   └── customer.service.ts
├── types/
│   └── customer.types.ts
└── pages/
    ├── CustomerList.tsx
    ├── CustomerCreate.tsx
    └── CustomerDetail.tsx
```

## 10.5 Code Quality Requirements

Generated code should:

-   Compile against the approved base code.
-   Avoid unnecessary duplicated components.
-   Avoid hardcoded project-specific secrets.
-   Use typed interfaces.
-   Follow linting and formatting rules.
-   Use the approved Design System rather than recreating equivalent UI
    elements.
-   Separate presentation, data access, and business logic according to
    company conventions.
-   Include clear TODO markers for logic that requires developer
    implementation.
-   Avoid overwriting unrelated files when integrated into an existing
    project.

## 10.6 Export Packaging

The initial export should provide a downloadable archive containing
generated files and a manifest.

The manifest should include:

-   Project and module identifiers.
-   Definition schema version.
-   Generator version.
-   Base code template version.
-   Generated file list.
-   Export timestamp.

A full project scaffold may be supported if it can be generated safely
from the approved base code. Otherwise, export only the module files and
required integration instructions.

------------------------------------------------------------------------

# 11. Backend Contract Generator

## 11.1 Objective

Generate a structured contract that helps Backend Developers understand
the data and API requirements implied by the mockup.

## 11.2 Contract Scope

Depending on configured page and component behavior, generate:

-   Entity and field definitions.
-   Field types.
-   Required and optional attributes.
-   Validation constraints.
-   List and detail data requirements.
-   Search and filter parameters.
-   Sorting parameters.
-   Pagination parameters.
-   Create request structure.
-   Update request structure.
-   Response structure.
-   Error response expectations.
-   Relationship references where configured.

## 11.3 Output Format

Initial output format: JSON.

The contract must clearly distinguish generated assumptions from
explicitly configured business requirements. It must not silently invent
business rules or database relationships.

Potential future formats include OpenAPI specification, subject to
technical assessment.

------------------------------------------------------------------------

# 12. QA Scenario Generator

## 12.1 Objective

Reduce repetitive testing for standardized common components and provide
a reusable starting point for QA.

## 12.2 Scenario Categories

**Form** - Required field validation. - Invalid input. - Valid
submission. - Minimum and maximum length. - Format validation. - Reset
behavior.

**Table** - Data rendering. - Empty state. - Search. - Sorting. -
Pagination. - Row actions.

**CRUD** - Create. - Read. - Update. - Delete. - Confirmation behavior.

**Interaction** - Modal open and close. - Tab navigation. - Button
actions. - Page navigation. - Notification behavior.

## 12.3 QA Output

Each generated scenario should contain:

-   Scenario ID.
-   Feature/component.
-   Scenario title.
-   Preconditions.
-   Test steps.
-   Test data.
-   Expected result.
-   Priority.
-   Scenario type (positive, negative, boundary).

The generator should support export in a structured format such as JSON
or CSV.

Generated scenarios are a starting point and do not replace
project-specific QA analysis or end-to-end testing.

------------------------------------------------------------------------

# 13. Design System & Component Administration

## 13.1 Design System Governance

The company's existing Design System remains the single UI standard for
Modula.

Modula must not introduce a parallel design system without an approved
reason.

## 13.2 Component Metadata

Each component should have:

-   Unique component key.
-   Display name.
-   Category.
-   Description.
-   Version.
-   Property schema.
-   Default properties.
-   Allowed parent/child rules.
-   Renderer mapping.
-   Generator mapping.
-   Validation rules.
-   Usage documentation.
-   Deprecation status.

## 13.3 Component Lifecycle

Administrators with appropriate permissions should be able to manage
component availability and versions.

Component changes must consider existing projects that reference earlier
versions.

Breaking changes require migration guidance.

------------------------------------------------------------------------

# 14. Version History & Audit Trail

## 14.1 Project Versioning

The system should preserve meaningful project snapshots.

Initial requirements:

-   Save project changes.
-   Record version number.
-   Record author and timestamp.
-   Add optional version description.
-   View previous versions.
-   Restore an eligible previous version.
-   Compare definition changes where feasible.

## 14.2 Audit Events

Record important activities, including:

-   Login success/failure where appropriate.
-   User creation and deactivation.
-   Role changes.
-   Project creation and deletion.
-   Project sharing and permission changes.
-   Component library changes.
-   Project exports.
-   Version restoration.

Audit logs must not expose passwords, tokens, or other secrets.

------------------------------------------------------------------------

# 15. Backend & Data Architecture

## 15.1 Architecture Direction

The backend and persistent storage must support authentication, user
management, project ownership, collaboration, definitions, version
history, and generator operations.

The backend technology must be selected or retained based on the
existing repository and company engineering standards. Do not introduce
a new backend stack without an explicit architecture decision.

## 15.2 Suggested Domain Modules

-   Authentication.
-   User Management.
-   Role & Permission.
-   Project Management.
-   Project Collaboration.
-   Component Library.
-   Module Definition.
-   Page Builder.
-   Code Generation.
-   Contract Generation.
-   QA Scenario Generation.
-   Version History.
-   Audit Log.

## 15.3 Suggested Data Entities

Minimum conceptual entities:

-   users
-   roles
-   permissions
-   role_permissions
-   user_roles
-   projects
-   project_members
-   project_versions
-   module_definitions
-   page_definitions
-   component_definitions
-   export_histories
-   audit_logs

The final schema should be normalized and designed around actual query
and access patterns. JSON-based definitions may be stored as structured
JSON where supported by the chosen database.

------------------------------------------------------------------------

# 16. Non-Functional Requirements

## 16.1 Security

-   HTTPS in production.
-   Secure password hashing using Argon2id or bcrypt.
-   Backend-enforced authentication and authorization.
-   Project-level access control.
-   Rate limiting for authentication endpoints.
-   Secure session/token lifecycle.
-   Input validation and output encoding.
-   Protection against common web vulnerabilities.
-   Secrets stored outside source code.
-   Audit logging for sensitive actions.

## 16.2 Performance

-   Builder interactions should remain responsive for normal project
    sizes.
-   Component rendering should avoid unnecessary re-renders.
-   Large project definitions should be loaded and saved efficiently.
-   Code generation should provide progress and error feedback when
    processing takes significant time.
-   Use pagination or virtualization where appropriate for large lists.

Performance targets should be measured and agreed during implementation
rather than assumed.

## 16.3 Reliability

-   Validate definitions before saving and exporting.
-   Prevent accidental loss of unsaved changes.
-   Provide clear error states.
-   Preserve project data during application upgrades.
-   Use schema migration strategies.
-   Back up persistent project data according to company policy.

## 16.4 Maintainability

-   Modular architecture.
-   Typed schemas and interfaces.
-   Consistent coding conventions.
-   Reusable components.
-   Automated tests for critical generator behavior.
-   Documentation for component definitions and generator templates.

------------------------------------------------------------------------

# 17. MVP Scope & Prioritization

## 17.1 P0 -- Core MVP

**Platform & Access** - Internal login/logout. - User management. -
Initial RBAC. - Protected routes and APIs. - Project ownership and
access control.

**Builder** - Component-based drag & drop. - Existing Design System
integration. - Page management. - Properties panel. - Component
configuration. - Live preview. - Basic undo/redo. - Builder validation.

**Prototype** - Common CRUD interactions. - Form validation. - Search,
filter, sorting, and pagination simulation. - Mock data management. -
Presentation mode.

**Generator** - Fixed company base code integration. - React code
export. - JSON contract export. - Export manifest and validation.

## 17.2 P1 -- Productivity Enhancement

-   Project sharing improvements.
-   Version history and restore.
-   Reusable project templates.
-   Expanded component library.
-   QA scenario generator.
-   Component documentation.
-   Improved schema migration.
-   Export comparison and reports.

## 17.3 P2 -- Future Enhancement

-   Advanced collaboration.
-   Advanced visual diff.
-   Automated test script generation.
-   Additional contract formats.
-   Component usage analytics.
-   Advanced project governance.

------------------------------------------------------------------------

# 18. Implementation Roadmap

  -----------------------------------------------------------------------
  Phase                   Focus                   Key Deliverable
  ----------------------- ----------------------- -----------------------
  0                       Existing application    Assessment and gap
                          audit                   analysis

  1                       Authentication and      Internal account, RBAC,
                          project foundation      project workspace

  2                       Builder enhancement     Structured
                                                  component-based builder

  3                       Interactive prototype   Functional mockup and
                                                  presentation mode

  4                       Code generation         React output aligned
                                                  with company base code

  5                       Contract and QA         JSON contract and
                                                  reusable QA scenarios

  6                       Hardening               Security, performance,
                                                  testing, documentation
  -----------------------------------------------------------------------

Phases may run in parallel where dependencies allow. The sequence should
be finalized after the existing-code audit.

------------------------------------------------------------------------

# 19. Acceptance Criteria

## 19.1 Authentication

-   Public registration is unavailable.
-   Authorized administrators can create or invite users.
-   Users can log in and log out.
-   Deactivated users cannot access protected resources.
-   Backend enforces role and permission checks.

## 19.2 Project Management

-   Users can create and manage projects according to their permissions.
-   Each project has an owner.
-   Project access is restricted to authorized members.
-   Editors can modify permitted projects.
-   Viewers cannot modify project definitions.

## 19.3 Builder

-   Users can add components from the library.
-   Users can reorder and configure components.
-   Invalid component configurations are identified.
-   The builder follows Design System layout rules.
-   Saved definitions can be reopened and edited.

## 19.4 Interactive Prototype

-   Configured navigation works.
-   Common CRUD interactions can be simulated.
-   Form validations behave according to configuration.
-   Mock data can be reset.
-   Presentation mode hides builder-only controls.

## 19.5 React Code Generator

-   Generated code follows the approved company base code.
-   Generated code uses approved Design System components.
-   Output passes agreed build, lint, and type-check validation.
-   Export includes a manifest and generator/template version.
-   Generated code can be continued by developers without repeating
    common slicing.

## 19.6 Contract Generator

-   Contract reflects configured fields and validation.
-   Request and response structures are consistent.
-   Assumptions are clearly identified.
-   Contract can be downloaded.

## 19.7 QA Generator

-   Common component scenarios can be generated.
-   Scenarios include steps and expected results.
-   Output can be exported in a structured format.
-   Project-specific scenarios remain editable by QA.

------------------------------------------------------------------------

# 20. Risks & Mitigation

  -----------------------------------------------------------------------
  Risk                    Impact                  Mitigation
  ----------------------- ----------------------- -----------------------
  Existing schema is      Breaking changes to     Audit and version
  insufficient            projects                schema before extension

  Generated code differs  Developers must         Use actual base code
  from base code          refactor output         templates and automated
                                                  validation

  Component behavior is   Mockup and generated    Define shared component
  inconsistent            code differ             contracts and tests

  Scope becomes too broad Delayed delivery        Prioritize P0 and
                                                  deliver incrementally

  Permission gaps         Unauthorized project    Enforce access control
                          access                  on backend

  Component updates break Existing mockups become Version components and
  old projects            invalid                 provide migrations

  Generated QA scenarios  False confidence in     Treat output as
  are incomplete          testing                 reusable baseline, not
                                                  complete test coverage
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 21. Success Metrics

The effectiveness of Modula should be measured against a baseline
captured before rollout.

Suggested metrics:

1.  Time required to create a standard CMS mockup.
2.  Time required to produce a first usable frontend implementation.
3.  Percentage of generated code accepted without repeating common
    slicing.
4.  Reduction in repetitive common-component implementation effort.
5.  Reuse rate of standardized components.
6.  Number of projects using Modula.
7.  QA effort spent on common versus project-specific scenarios.
8.  User adoption across Presales, BPA, UI/UX, Developer, and QA.

Do not claim manday savings until baseline and post-implementation
measurements are available.

------------------------------------------------------------------------

# 22. Technical Decisions & Open Questions

The following decisions are established:

  -----------------------------------------------------------------------
  Topic                               Decision
  ----------------------------------- -----------------------------------
  Product direction                   Revamp existing Modula

  Builder approach                    Component-Based Drag & Drop

  Freeform canvas                     Not required

  Design System                       Reuse existing company Design
                                      System

  Account model                       Internal Account

  Public registration                 Disabled

  Base code                           One fixed company standard

  Module Definition                   Retain and extend existing JSON
                                      schema

  Main outputs                        Interactive Mockup, React Code,
                                      JSON Contract, QA Scenarios
  -----------------------------------------------------------------------

The following items require technical verification before
implementation:

1.  What is the exact company base code repository and its supported
    conventions?
2.  Does the current export already generate code, and how closely does
    it match the company base code?
3.  What drag-and-drop capabilities are already implemented in Layout
    Builder?
4.  What is the actual structure and compatibility requirement of Module
    Definition v1?
5.  Which backend and database are already available or mandated by
    company standards?
6.  What authentication/session approach aligns with company
    infrastructure?
7.  Which existing components are approved for reuse in generated
    projects?
8.  What are the expected project size and performance requirements?

These are technical discovery items, not reasons to delay documenting
the target direction.

------------------------------------------------------------------------

# 23. Final Product Direction

Modula 2.0 will evolve from an existing CMS mockup/module generator into
an internal productivity platform that connects business requirement
visualization with standardized frontend development.

The platform will allow users to assemble pages using reusable Design
System components, simulate common application behavior, and generate
multiple development artifacts from a canonical module definition.

All generated React code must follow the company's fixed base code
standard. Internal accounts, project ownership, and role-based access
will govern the use of the platform.

**Core principle:**

> What You Build Is What You Preview, What You Define Is What You
> Generate.

Modula should eliminate repetitive work---not introduce another layer of
work for the teams using it.
