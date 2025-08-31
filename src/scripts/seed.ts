import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { hashPassword } from '../lib/auth';

const nostalgicPosts = [
  {
    content: "blowing on your NES cartridges to make them work?",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
    tags: ["Games", "Gadgets"],
    decade: "80s" as const
  },
  {
    content: "rewinding VHS tapes and hoping you stopped at the right spot?",
    image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&h=600&fit=crop",
    tags: ["Movies", "Gadgets"],
    decade: "90s" as const
  },
  {
    content: "waiting for your favorite song to come on the radio so you could record it on cassette?",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop",
    tags: ["Music"],
    decade: "90s" as const
  },
  {
    content: "the satisfying click of hanging up a phone?",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop",
    tags: ["Gadgets"],
    decade: "80s" as const
  },
  {
    content: "Saturday morning cartoons and sugary cereal?",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop",
    tags: ["Cartoons", "TV Shows"],
    decade: "90s" as const
  },
  {
    content: "having to choose between the internet and using the phone?",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
    tags: ["Gadgets"],
    decade: "90s" as const
  },
  {
    content: "Blockbuster Friday nights and the stress of late fees?",
    image: "https://images.unsplash.com/photo-1489599112320-0e3a5b7d0ade?w=800&h=600&fit=crop",
    tags: ["Movies", "Places"],
    decade: "2000s" as const
  },
  {
    content: "when MTV actually played music videos?",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    tags: ["Music", "TV Shows"],
    decade: "90s" as const
  },
  {
    content: "Tamagotchis and the constant fear they would die?",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop",
    tags: ["Toys", "Games"],
    decade: "90s" as const
  },
  {
    content: "dial-up internet sounds and 56k modems?",
    image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=800&h=600&fit=crop",
    tags: ["Gadgets"],
    decade: "90s" as const
  },
  {
    content: "having to print out MapQuest directions before going anywhere?",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&h=600&fit=crop",
    tags: ["Gadgets"],
    decade: "2000s" as const
  },
  {
    content: "CD players with anti-skip protection for jogging?",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    tags: ["Music", "Gadgets"],
    decade: "90s" as const
  },
  {
    content: "when phones had actual buttons and you could text without looking?",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop",
    tags: ["Gadgets"],
    decade: "2000s" as const
  },
  {
    content: "The Oregon Trail and dying of dysentery in computer class?",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
    tags: ["Games"],
    decade: "90s" as const
  },
  {
    content: "pagers and feeling so important when yours went off?",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop",
    tags: ["Gadgets"],
    decade: "90s" as const
  },
  {
    content: "Furby's creepy midnight chatter?",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop",
    tags: ["Toys"],
    decade: "90s" as const
  },
  {
    content: "burning CDs and making the perfect mixtape?",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    tags: ["Music"],
    decade: "2000s" as const
  },
  {
    content: "AIM away messages and spending hours crafting the perfect one?",
    image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=800&h=600&fit=crop",
    tags: ["Gadgets"],
    decade: "2000s" as const
  },
  {
    content: "Gameboy under the covers with that tiny light attachment?",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
    tags: ["Games", "Gadgets"],
    decade: "90s" as const
  },
  {
    content: "when having a cell phone made you the coolest kid in school?",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop",
    tags: ["Gadgets"],
    decade: "2000s" as const
  }
];

const nostalgicComments = [
  "OMG yes! I did this every single day!",
  "This takes me back to being 12 again!",
  "I still have mine somewhere in the attic!",
  "The good old days when things were simpler",
  "My mom threw mine away and I'm still not over it",
  "I remember saving up my allowance for months to buy this!",
  "This was literally my childhood!",
  "Why did we ever think this was cool? 😂",
  "I had the exact same one in red!",
  "Those were the days... *sigh*",
  "I spent SO many hours doing this",
  "My parents thought I was crazy for wanting this",
  "Best purchase of my teenage years",
  "I miss when technology was this simple",
  "This unlocked a core memory!"
];

const usernames = [
  "90sKid", "NostalgicNinja", "RetroRaven", "VintageVibe", "MemoryLane",
  "ThrowbackThursday", "ClassicCool", "OldSchoolRule", "VintageVibes", "RetroRewind",
  "NostalgiaTrip", "BackInMyDay", "GoodOldDays", "MemoryKeeper", "TimeWarp",
  "RetroGamer", "VintageCollector", "NostalgicSoul", "MemoryMaker", "PastPerfect",
  "RetroRevival", "VintageVault", "MemoryMuseum", "NostalgicNerd", "TimeCapsule",
  "RetroRealm", "VintageVoyager", "MemoryMaster", "NostalgicNomad", "PastPassion",
  "RetroRider", "VintageVanguard", "MemoryMagic", "NostalgicNightmare", "TimeTraveler",
  "RetroRocker", "VintageViral", "MemoryMania", "NostalgicNature", "PastPresent",
  "RetroRapture", "VintageVision", "MemoryMiracle", "NostalgicNotion", "TimeTicket",
  "RetroRadical", "VintageVortex", "MemoryMystic", "NostalgicNinja2", "PastPlanet"
];

const bios = [
  "Child of the 90s who still believes in Saturday morning cartoons",
  "Collector of vintage everything, especially if it has batteries",
  "Missing the days when phones were just phones",
  "Professional nostalgic and amateur time traveler",
  "Still waiting for my Hogwarts letter",
  "Proud owner of 47 Tamagotchis (only 3 are still alive)",
  "Will trade modern tech for a working Game Boy any day",
  "Remember when the internet made that screechy sound?",
  "Blockbuster frequent flyer, RIP to the real MVP",
  "Dial-up survivor and proud of it"
];

async function seedDatabase() {
  try {
    await connectDB();
    
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log('👥 Creating users...');
    const users = [];
    
    // Create demo users first
    const demoUser1 = new User({
      username: 'demo',
      email: 'demo@example.com',
      password: await hashPassword('demo123'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      bio: 'Demo user for testing the platform'
    });
    
    const demoUser2 = new User({
      username: 'nostalgia',
      email: 'nostalgia@example.com',
      password: await hashPassword('90skid'),
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
      bio: 'Professional 90s kid and nostalgia enthusiast'
    });

    await demoUser1.save();
    await demoUser2.save();
    users.push(demoUser1, demoUser2);

    // Create additional random users
    for (let i = 0; i < 48; i++) {
      const randomAvatar = `https://images.unsplash.com/photo-${1494790108755 + i}?w=150&h=150&fit=crop&crop=face`;
      const user = new User({
        username: usernames[i],
        email: `${usernames[i].toLowerCase()}@example.com`,
        password: await hashPassword('password123'),
        avatar: randomAvatar,
        bio: bios[i % bios.length]
      });
      await user.save();
      users.push(user);
    }

    console.log('📝 Creating posts...');
    const posts = [];
    
    for (let i = 0; i < nostalgicPosts.length; i++) {
      const postData = nostalgicPosts[i];
      const randomAuthor = users[Math.floor(Math.random() * users.length)];
      
      const post = new Post({
        author: randomAuthor._id,
        content: postData.content,
        image: postData.image,
        tags: postData.tags,
        decade: postData.decade,
        likes: [],
        comments: []
      });
      
      await post.save();
      posts.push(post);
    }

    console.log('💬 Creating comments...');
    for (const post of posts) {
      const numComments = Math.floor(Math.random() * 8) + 3; // 3-10 comments per post
      
      for (let i = 0; i < numComments; i++) {
        const randomAuthor = users[Math.floor(Math.random() * users.length)];
        const randomComment = nostalgicComments[Math.floor(Math.random() * nostalgicComments.length)];
        
        const comment = new Comment({
          author: randomAuthor._id,
          post: post._id,
          content: randomComment,
          likes: []
        });
        
        await comment.save();
        post.comments.push(comment._id);
      }
      
      await post.save();
    }

    console.log('❤️ Adding likes...');
    for (const post of posts) {
      const numLikes = Math.floor(Math.random() * 25) + 5; // 5-30 likes per post
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < Math.min(numLikes, users.length); i++) {
        if (!post.likes.includes(shuffledUsers[i]._id)) {
          post.likes.push(shuffledUsers[i]._id);
          shuffledUsers[i].likedPosts.push(post._id);
          await shuffledUsers[i].save();
        }
      }
      
      await post.save();
    }

    console.log('🎉 Database seeded successfully!');
    console.log(`Created ${users.length} users, ${posts.length} posts, and comments`);
    console.log('\n📋 Demo login credentials:');
    console.log('Email: demo@example.com | Password: demo123');
    console.log('Email: nostalgia@example.com | Password: 90skid');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
