# Stardew Valley Calendar Planner

Docker setup is still in progress. In the meantime, after doing an `npm i` in both the `calendar-app` and `calendar-db` directories, to set up, you may make use of the VSCode tasks.

## 1. Press Commands to Show All Commands

Mac users use `command + shift + p`
Windows users use `control + shift p`
You should get the following popup:
![Show All Commands](./assets/show-commands.png)

## 2. Select `Tasks: Run Task`

You should see these options:
![Show All Commands](./assets/run-task.png)

## 3. Select `Start App`

Your terminal should then run 2 tasks `app` and `db`:
![Show All Commands](./assets/run-task-continue.png)

And voila! If you have not already, you will be prompted to create a Strapi account locally, but after that is done, your calendar app should connect to your local Strapi server for use!
