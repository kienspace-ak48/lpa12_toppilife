function toggleSection(id) {
  const el = document.querySelector("#" + id);
  el.classList.toggle("hidden");
}
document.querySelectorAll("section > div").forEach((el) => {
  el.classList.toggle("hidden");
});
//
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#configForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    //target_user_list

    let targetAudienceArr = [];

    document
      .querySelectorAll("#target_audience_wrapper .instance")
      .forEach((el) => {
        let card = {
          img_url: el.querySelector('[name="img_url"]').value,
          title: el.querySelector('[name="title"]').value,
          desc: el.querySelector('[name="desc"]').value,
        };

        targetAudienceArr.push(card);
      });

    data.target_audience_cards = targetAudienceArr;
    //
    let bodyAreaArr = [];
    document.querySelectorAll('#body_area_wrapper .instance').forEach(el=>{
      const ba ={
        img_url: el.querySelector('[_img_url]').value.trim(),
        title: el.querySelector('[_label]').value.trim()
      }
      bodyAreaArr.push(ba);
    });
    data.body_area_cards = bodyAreaArr;
    // usage instruction
    let usageInstructionArr =[];
    document.querySelectorAll('#usage_instruction_wrapper .instance').forEach(el=>{
      const ui={
        img_url: el.querySelector('[_img_url]').value.trim(),
        title: el.querySelector('[_label]').value.trim(),
        step: el.querySelector('[_step]').value.trim(),
        desc: el.querySelector('[_desc]').value.trim()
      }
      usageInstructionArr.push(ui);
    })
    data.usage_instruction_cards =usageInstructionArr;
    // featured
    let featuredArr =[];
    document.querySelectorAll('#featured_wrapper .instance').forEach(el=>{
      const f ={
        img_url: el.querySelector('[_img_url]').value.trim(),
        title: el.querySelector('[_label]').value.trim(),
        desc: el.querySelector('[_desc]').value.trim()
      }
      featuredArr.push(f);
    })
    data.featured_cards = featuredArr;
    //
    let reviewArr = [];
    document.querySelectorAll("#review_wapper .instance").forEach((el) => {
      const video = {
        badge: el.querySelector("[badge]").value.trim(),
        lable: el.querySelector("[lable]").value.trim(),
        video_url: el.querySelector("[video]").value.trim(),
      };
      reviewArr.push(video);
    });
    data.review_videos = reviewArr;
    //feedback
    let feedbackArr =[];
    document.querySelectorAll('#feedback_wapper .instance').forEach(el=>{
      const fb ={
        title: el.querySelector('[lable]').value.trim(),
        desc: el.querySelector('[desc]').value.trim(),
        star: Number(el.querySelector('[star]').value),
        img_url: (el.querySelector("[_feedback_img_url]")?.value || "").trim(),
      }
      feedbackArr.push(fb);
    })
    data.feedback_list =feedbackArr;
    // teachnology
    let teachnologyArr =[];
    document.querySelectorAll('#teachnology_wrapper .instance').forEach(el=>{
      const t ={
        badge: el.querySelector('[_badge]').value,
        img_url: el.querySelector('[_img_url]').value.trim(),
        title: el.querySelector('[_label]').value,
        desc: el.querySelector('[_desc]').value
      }
      teachnologyArr.push(t)
    })
    console.log(teachnologyArr)
    data.teachnology_cards=teachnologyArr;
    // ================= ... ================//
    if(document.querySelector('#comparison_after')){
      data.comparison_after= document
      .querySelector('#comparison_after')
      .value.split('\n')
      .map(i=>i.trim())
      .filter(i=>i!=="");
    }
    if(document.querySelector('#comparison_before')){
      data.comparison_before= document
      .querySelector('#comparison_before')
      .value.split('\n')
      .map(i=>i.trim())
      .filter(i=>i!=="");
    }
    //
    if(document.querySelector('#box_content_list')){
      data.box_content_list= document
      .querySelector('#box_content_list')
      .value.split('\n')
      .map(i=>i.trim())
      .filter(i=>i!=="");
    }
    //
    if (document.querySelector("#warrantys")) {
      data.warrantys = document
        .querySelector("#warrantys")
        .value.split("\n")
        .map((i) => i.trim())
        .filter((i) => i !== "");
    }
    if (document.querySelector("#purchase_policy_wrapper")) {
      const purchasePolicyArr = [];
      document.querySelectorAll("#purchase_policy_wrapper .instance").forEach((el) => {
        const icon = el.querySelector("[_icon]")?.value?.trim() || "Truck";
        const text = el.querySelector("[_text]")?.value?.trim() || "";
        if (!text) return;
        purchasePolicyArr.push({ icon, text });
      });
      data.purchase_policy = purchasePolicyArr;
    }
    //
    if (document.querySelector("#hero_benefits")) {
      data.hero_benefits = document
        .querySelector("#hero_benefits")
        .value.split("\n")
        .map((i) => i.trim())
        .filter((i) => i !== "");
    }
    //convert textarea -> array

    console.log(data);
    submitForm(data);
  });
  //
  async function submitForm(data) {
    fetch("/admin/page-config/create-update", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        alert("update success");
      })
      .catch((err) => {
        (console.log(err), alert("update failed"));
      });
  }
});
// ------------------ target audience ------------------- //
const targetWrapper = document.querySelector("#target_audience_wrapper");
const targetTemplate = document.querySelector("#target_audience_template");
const ctaAddTarget = document.querySelector("#cta_add_target_card");

if (targetWrapper && targetTemplate && ctaAddTarget) {
  ctaAddTarget.addEventListener("click", () => {
    const clone = targetTemplate.content.cloneNode(true);
    targetWrapper.appendChild(clone);
  });

  targetWrapper.addEventListener("click", (ev) => {
    if (ev.target.classList.contains("remove-instance")) {
      const instance = ev.target.closest(".instance");
      instance.remove();
    }
  });
}
