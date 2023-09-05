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

  // Start listening for incoming updates
  await bot.startWebhook('/api', null, 3000); // Replace with the desired port
  // try {
  //   if (!(req.method === 'POST')) {
  //     res.status(200).json('Listening to bot events...');
  //   }
  // } catch (error) {
  //   console.log('Error:', error);
  //   res.status(500).end('Internal Server Error');
  // }
};

module.exports = production;