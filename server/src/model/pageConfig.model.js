const mongoose = require("mongoose");
const lsugify = require("slugify");

const pageConfigSchema = new mongoose.Schema({
  hero: {
    badge: String,
    title: String,
    desc: String,
    img_url: String,
    benefits: [],
    _id: false,
  },
  // PurchaseFrame
  purchase_frame:{
    title: String,
    countdown: Date,
    floating_cta: String,
    sale: {
      presale: String,
      save_money: String,
      price: String,
      note: String,
      _id: false
    },
    img_url: String,
    policy: []
  },
  warrantys:[],
// const TargetAudience = () => {
  target_audience:{
    title: String,
    cards: [
      {img_url: String, title: String, desc: String}
    ]
  },
  review: {
    title: String,
    videos:[{
      badge: String,
      lable: String,
      video_url: String,
      _id: false
    }]
  },
  feedback: {
    title: String,
    list: [
      {
      title: String,
      desc: String,
      star: Number,
      _id: false
  }]
  },
  teachnology:{
    title: String,
    desc: String,
    cards: [
      {
        badge: String,
        img_url: String,
        title: String,
        desc: String,
        _id: false
      }
    ]
  },
  is_featured: {
    title: String,
    cards: [
      {
        img_url: String,
        title: String,
        desc: String,
        _id: false
      }
    ]
  },
  box_content:{
    title: String,
    img_url: String,
    list: [],
  },
  usage_instruction:{
    title: String,
    note: String,
    cards: [
      {img_url: String, step: Number, title: String, desc: String}
    ],
    notes: String
  },
  body_area:{
   title: String,
   cards: [
    {img_url: String, title: String, _id: false}
   ] 
  },
  comparison: {
    before: {
      title: String,
      list: [],
    },
    after: {
      title: String,
      list: []
    }
  },
  customize: {
  }
}, {timestamps: true});

module.exports = mongoose.model('page_config', pageConfigSchema);
