import * as userModel from "../models/userModel.js";

export async function getUsers(req, res) {
  try {
    const users = await userModel.getAllActiveUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
}

export async function getUser(req, res) {
  try {
    const user = await userModel.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export async function createUser(req, res) {
  try {
    const user = await userModel.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await userModel.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
}