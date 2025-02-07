import request from "supertest";
import app from "../app";
import { User } from "../models/user";
import bcrypt from "bcryptjs";


describe("User API Tests", () => {
    const mockUser = {
        username: "testuser",
        email: "test@example.com",
        password: "Test@123",
    };

    // ✅ Test Register API
    it("should register a user successfully", async () => {
        const res = await request(app).post("/api/auth/register").send(mockUser);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User registered successfully");
    });

    // ❌ Test Register API (Duplicate Email)
    it("should return an error if email is already taken", async () => {
        await new User(mockUser).save(); // Manually create user

        const res = await request(app).post("/api/auth/register").send(mockUser);
        console.log(res.body);
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.error).toBe("User already exists");
    });

    // ✅ Test Login API (Success)
    it("should log in successfully and return a token", async () => {
        await new User(mockUser).save(); // Manually create user

        const res = await request(app).post("/api/auth/login").send({
            email: mockUser.email,
            password: mockUser.password,
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Login successful");
        expect(res.body.data.token).toBeDefined();
    });

    // ❌ Test Login API (Wrong Password)
    it("should return an error for invalid credentials", async () => {
        await new User(mockUser).save(); // Manually create user

        const res = await request(app).post("/api/auth/login").send({
            email: mockUser.email,
            password: "WrongPassword",
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe("Invalid credentials");
    });

    // ❌ Test Login API (Nonexistent User)
    it("should return an error if user does not exist", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "doesnotexist@example.com",
            password: "randompassword",
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe("Invalid credentials");
    });
    // ✅ Test Reset Password API (Success)
    it("should reset password successfully", async () => {
        const user = await new User(mockUser).save(); // Manually create user

        const res = await request(app)
            .put("/api/auth/reset-password")
            .send({ email: mockUser.email, password: "newpassword" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Password reset successfully");

        const updatedUser = await User.findById(user._id);
        const isMatch = await bcrypt.compare("newpassword", updatedUser!.password);
        expect(isMatch).toBe(true);
    });

    // ❌ Test Reset Password API (User Does Not Exist)
    it("should return an error if user does not exist", async () => {
        const res = await request(app)
            .put("/api/auth/reset-password")
            .send({ email: "doesnotexist@example.com", password: "randompassword" });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe("User not found");
    });

});
