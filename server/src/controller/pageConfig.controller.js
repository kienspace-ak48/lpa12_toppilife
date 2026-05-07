const pageConfigService = require("../services/pageConfig.service");

const CNAME = "pageconfig.controller.js ";
const VNAME = "admin/pageconfig";

const pageConfigController = () => {
  return {
    Index: async (req, res) => {
      try {
        const pc = await pageConfigService.GetOneRecord();
        res.render(VNAME + "/index", { pc });
      } catch (error) {
        res.render(VNAME + "/index", { pc: {} });
      }
    },
    SaveAndUpdate: async (req, res) => {
      try {
        const data = req.body;
        const heroPath = String(data.hero_media_url || data.hero_img_url || "").trim();
        const pageconfigDTO = {
          hero: {
            badge: data.hero_badge,
            title: data.hero_title,
            desc: data.hero_desc,
            media_type: data.hero_media_type || "image",
            media_url: heroPath,
            img_url: heroPath,
            benefits: data.hero_benefits,
          },
          purchase_frame: {
            title: data.purchase_title,
            countdown: data.purchase_countdown,
            floating_cta: data.purchase_floating_cta,
            sale: {
              presale: data.purchase_sale_presale,
              save_money: data.purchase_sale_save_money,
              price: data.purchase_sale_price,
              note: data.purchase_sale_note,
              _id: false,
            },
            img_url: data.purchase_img_url,
            policy: data.purchase_policy,
          },
          warrantys: data.warrantys,
          target_audience: {
            title: data.target_audience_title,
            cards: data.target_audience_cards,
          },
          review: {
            title: data.review_title,
            videos: data.review_videos
          },
          feedback: {
            title: data.feedback_title,
            list: data.feedback_list
          },
          teachnology: {
            title: data.teachnology_title,
            desc: data.teachnology_desc,
            cards: data.teachnology_cards
          },
          is_featured: {
            title: data.featured_title,
            cards: data.featured_cards
          },
          box_content: {
            title: data.box_content_title,
            img_url: data.box_content_img_url,
            list: data.box_content_list
          },
          usage_instruction:{
            title: data.usage_instruction_title,
            note: data.usage_instruction_note,
            cards: data.usage_instruction_cards
          },
          body_area: {
            title: data.body_area_title,
            cards: data.body_area_cards
          },
          comparison: {
            before: data.comparison_before,
            after: data.comparison_after
          }

       
        };
        const task1 = await pageConfigService.AddAndUpdate(pageconfigDTO);
        if (!task1) {
          return res.error("Process update failed", 400);
        }
        res.success();
      } catch (error) {
        console.log(CNAME, error.message);
        res.error(error.message);
        // res.render(VNAME+'/index', {success: false, error: error.message})
      }
    },
    CustomizeSection: async (req, res) => {
      try {
        // const pc = await getPageConfigFx();
        const pc = await pageConfigService.GetOneRecord(); 
        res.render(VNAME + "/customize", { data: pc });
      } catch (error) {
        res.render(VNAME + "/customize", { data: {} });
      }
    },
    //
    SaveCustomizeSection: async (req, res) => {
      try {
        const data = req.body;
        const cDTO = {
          customize: {
            email: data.pageinfo_email,
            phone: data.pageinfo_phone,
            zalo: data.pageinfo_zalo,
            address: data.pageinfo_address,
            facebook: data.pageinfo_facebook,
            tiktok: data.pageinfo_tiktok,
            youtube: data.pageinfo_youtube,
            worktime: data.worktime,
            title: data.webname,
            canonical: data.canonical,
            img: data.img || "image1.jpg",
            desc: data.desc,
            keywords: data.keywords,
            gg_a: data.gg_a || "--no--",
            gg_wt: data.gg_wt || "--no--",
            fb_a: data.fb_a || "--no--",
            fb_wt: data.fb_wt || "--no--",
            gtm_id: (data.gtm_id || "").trim(),
            fb_pixel_id: (data.fb_pixel_id || "").trim(),
          },
        };
        const task1 = await pageConfigService.AddAndUpdate(cDTO);
        // const task1 = true;
        if (!task1) {
          throw new Error(CNAME + "update customize_section failed");
        }
        res.json({ success: true });
      } catch (error) {
        // res.render(VANME+'')
        console.log(CNAME, error.message);
        res.status(500).json({ success: false, mess: "Server error" });
      }
    },
  };
};

module.exports = pageConfigController;
