from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

bot = Bot(token="7990940637:AAGEAS5uYPI29GjuYLcT4MG4JKADsSSMWbk")
dp = Dispatcher()

@dp.message(Command(commands=["start"]))
async def start(message: types.Message):
    ARTICLE_URL = "https://t.me/BeanTycoonBot/mini-app-eight-nu.vercel.app/"
    keyboard = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="🚀 Запустить игру!", url=ARTICLE_URL)]])
    await message.answer("Когда-то Барон Бобби Бин был простым алхимиком, но после того, как нашёл мистическое кофейное зерно, в его жизни появились тайны, интриги и ароматные приключения.\n"
                         " Теперь он ведет тайный бизнес, собирая редкие сорта кофе по всему миру.", reply_markup=keyboard)

if __name__ == "__main__":
    dp.run_polling(bot)
