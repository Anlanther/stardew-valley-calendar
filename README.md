# Stardew Valley Calendar Planner

Docker setup is still in progress. In the meantime, after doing an `npm i` in both the `calendar-app` and `calendar-db` directories, to set up, you may make use of the VSCode tasks.

### Setting Up Locally

### 1. Press Commands to Show All Commands

Mac users use `command + shift + p`
Windows users use `control + shift p`
You should get the following popup:
![Show All Commands](./assets/show-commands.png)

### 2. Select `Tasks: Run Task`

You should see these options:
![Show All Commands](./assets/run-task.png)

### 3. Select `Start App`

Your terminal should then run 2 tasks `app` and `db`:
![Show All Commands](./assets/run-task-continue.png)

Note that if this is your first time starting the app, you will need to set up your local Strapi account here.

And voila! If you have not already, you will be prompted to create a Strapi account locally, but after that is done, your calendar app should connect to your local Strapi server for use!

## Setting Up Strapi Locally

If you are setting up Strapi for the first time, when you open [`localhost:1337/admin](http://localhost:1337/admin), it will prompt you to sign up. Do not worry, this sign up is free and just saves your login details locally.

Once you have signed in, you will need to create an API token, of which you will have to pass to the application.

### Generating Token

#### 1. Go to Settings and Click `Create new API Token`

![Show All Commands](./assets/strapi-settings.png)

#### 2. Give Token Full Access and Click `Save`

![Show All Commands](./assets/strapi-create-token.png)

A token should be generated for you to copy. Save this.
![Show All Commands](./assets/strapi-token.png)
