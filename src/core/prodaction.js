const VERCEL_URL = `${process.env.VERCEL_URL}`;

const production = async (
  req,
  res,
  bot
) => {

  if (!VERCEL_URL) {
    throw new Error('VERCEL_URL is not set.');
  }

  const getWebhookInfo = await bot.telegram.getWebhookInfo();
  if (getWebhookInfo.url !== VERCEL_URL + '/api') {
    await bot.telegram.deleteWebhook();
    await bot.telegram.setWebhook(`${VERCEL_URL}/api`);
  }

  await bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
  // if (req.method === 'POST') {
  //   await bot.handleUpdate(req.body, res);
  // } else {
  //   res.status(200).json('Listening to bot events...');
  // }
};

module.exports = production;