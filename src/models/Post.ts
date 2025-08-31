import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  image: string;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  tags: string[];
  decade: '80s' | '90s' | '2000s';
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Memory content is required'],
    maxlength: [1000, 'Memory cannot exceed 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Memory image is required']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  tags: [{
    type: String,
    enum: ['Cartoons', 'Music', 'Toys', 'Movies', 'TV Shows', 'Fashion', 'Gadgets', 'Games', 'Places'],
    required: false
  }],
  decade: {
    type: String,
    enum: ['80s', '90s', '2000s'],
    required: [true, 'Decade is required']
  }
}, {
  timestamps: true
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
