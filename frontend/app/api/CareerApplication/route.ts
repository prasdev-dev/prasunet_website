export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ⬇️ IMPORTANT: use require() for Prisma on Cloudflare
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      phone,
      email,
      resumeUrl,
      jobTitle,
      experience,
      coverLetter,
      linkedin,
      github,
      portfolio,
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !resumeUrl ||
      !jobTitle ||
      !experience
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to Prisma database
    await prisma.careerApplication.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        resumeUrl,
        jobTitle,
        experience: parseInt(experience, 10),
        coverLetter,
        linkedin,
        github,
        portfolio,
      },
    });

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Career Application Received",
      text: `
New application received:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Resume: ${resumeUrl}
Job Title: ${jobTitle}
Experience: ${experience} years
LinkedIn: ${linkedin}
GitHub: ${github}
Portfolio: ${portfolio}

Cover Letter:
${coverLetter}
      `,
    });

    return NextResponse.json(
      { message: "Application submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}