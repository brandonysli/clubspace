import pkg from "@prisma/client";
const { PrismaClient, Label } = pkg;
import clubdata from "./club_data_meetings.json" assert { type: "json" };

import AWS from "aws-sdk"; //aws module
import axios from "axios";
import sharp from "sharp"; //module to convert image files to webp




async function main(data) {
  const prisma = new PrismaClient();
  // await prisma.interestEvent.deleteMany();
  await prisma.clubFollowRelation.deleteMany();
  //await prisma.event.deleteMany();
  //await prisma.image.deleteMany();
  await prisma.clubMeeting.deleteMany();
  //await prisma.clubLabel.deleteMany();
  await prisma.club.deleteMany();

  const labelsMapping = {
    Academic: Label.Academic,
    Professional: Label.Professional,
    Creative: Label.Creative,
    Consulting: Label.Consulting,
    Dance: Label.Dance,
    Sports: Label.Sports,
    Entrepreneurship: Label.Entrepreneurship,
    Cultural: Label.Cultural,
    Sustainability: Label.Sustainability,
    Gaming: Label.Gaming,
    Technology: Label.Technology,
    Wellness: Label.Wellness,
    Language: Label.Language,
    Media: Label.Media,
    Music: Label.Music,
    Volunteer: Label.Volunteer,
    Political: Label.Political,
    Religious: Label.Religious,
    Science: Label.Science,
    Research: Label.Research,
    Social: Label.Social,
    Networking: Label.Networking,
  };

  const labels = [
    "Academic",
    "Professional",
    "Creative",
    "Consulting",
    "Dance",
    "Sports",
    "Entrepreneurship",
    "Cultural",
    "Sustainability",
    "Gaming",
    "Technology",
    "Wellness",
    "Language",
    "Media",
    "Music",
    "Volunteer",
    "Political",
    "Religious",
    "Science",
    "Research",
    "Social",
    "Networking",
  ];

  const day = {
    Monday: "Mon",
    Tuesday: "Tues",
    Wednesday: "Wed",
    Thursday: "Thurs",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  //loop through the clubs
  const clubs = clubdata;

  for (const club of clubs) {
    console.log(club.name);
    var labelsList = [];
    for (const l of club.category) {
      if (labels.includes(l)) {
        labelsList.push(labelsMapping[l]);
      }
    }

    // img upload to s3
    const imgUrl = club.imgblob;
    let c;
    if(process.env.NODE_ENV === 'production') {

    //AWS sdk config with DigitalOcean credentials for DO space
const s3 = new AWS.S3({
  endpoint: process.env.DIGITALOCEAN_ENDPOINT,
  accessKeyId: process.env.DIGITALOCEAN_ACCESS_KEY,
  secretAccessKey: process.env.DIGITALOCEAN_SECRET_ACCESS_KEY,
  region: process.env.DIGITALOCEAN_REGION,
});

    //Download image data with axios
    const response = await axios.get(imgUrl, {
      responseType: "arraybuffer",
    });
    //convert downloaded data to buffer
    const imageBuffer = Buffer.from(response.data);
    let sharpInstance = sharp(imageBuffer);
    // Get the image's metadata (width and height)
    const metadata = await sharpInstance.metadata();
    const { width, height } = metadata;
    // Check if image dimensions are greater than 128x128
    if (width > 128 && height > 128) {
      sharpInstance = sharpInstance.resize({
        width: 128,
        height: 128,
      });
    }
    //convert image to webp using sharp library
    const jpegBuffer = await sharpInstance.toFormat("jpeg").toBuffer();
    const webpBuffer = await sharpInstance.toFormat("webp").toBuffer();
    //generates unique key for each image using timestamp
    const jpegKey = `club_${club.name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()}_${Date.now()}.jpeg`;
    const webpKey = `club_${club.name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()}_${Date.now()}.webp`;
    //creates param for upload to bucket
    const jpegParams = {
      Bucket: "clubspace",
      Key: jpegKey,
      Body: jpegBuffer,
      ContentType: "image/jpeg",
      ACL: "public-read",
    };

    const webpParams = {
      Bucket: "clubspace",
      Key: webpKey,
      Body: webpBuffer,
      ContentType: "image/webp",
      ACL: "public-read",
    };
    //upload image buffer to S3
    const jpegUpload = await s3.upload(jpegParams).promise();
    const webpUpload = await s3.upload(webpParams).promise();
  
    c = await prisma.club.create({
      data: {
        name: club.name,
        description: club.mission,
        labels: {
          set: labelsList,
        },
        website: club.website,
        img: webpUpload.Location,
        imgAlt: jpegUpload.Location,
      },
    });
  }
  else{
    c = await prisma.club.create({
      data: {
        name: club.name,
        description: club.mission,
        labels: {
          set: labelsList,
        },
        website: club.website,
        img: imgUrl,
        imgAlt: imgUrl,
      },
    });
  }

    for (const meeting of club.meetings) {
      const m = await prisma.clubMeeting.create({
        data: {
          clubId: c.id,
          locationName: meeting["Meeting Location"],
          startTime: meeting["Meeting Start Time"],
          endTime: meeting["Meeting End Time"],
          day: day[meeting["Meeting Day"]],
        },
      });
    }
  }
}

main(clubdata).catch((e) => console.error(e));
