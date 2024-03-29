require('dotenv').config();
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook(process.env.WEBHOOK_URL);
hook.setUsername('ＰｒｏＳＫＰＯＯＰ');
hook.setAvatar(process.env.AVATAR_URL);

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = [10, 22];
rule.minute = 11;

async function createEmbed(src) {
  const embed = new MessageBuilder()
                .setTitle(process.env.BOT_TITLE)
                .setURL(process.env.BOT_URL)
                .setColor('#eb9834')
                .setImage(src)
                .setTimestamp();

  return embed;
}

const sendMessage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process'
    ]
  });
  const page = await browser.newPage();
  await page.goto('https://www.youtube.com/user/BBoyMikecrash/community');

  const postSrc = await page.evaluate(() => {
    const firstPost = document.querySelector('.style-scope .ytd-backstage-image-renderer .no-transition');

    return firstPost.children[0].src;
  });

  try {
    const embed = await createEmbed(postSrc);
    
    hook.send(embed);
  } catch (err) {
    throw new Error(err)
  }

};

// const job = schedule.scheduleJob(rule, sendMessage);
sendMessage();