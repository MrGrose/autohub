export type SocialLink = {
  href: string
  label: string
  iconSrc: string
}

export const socialLinks: SocialLink[] = [
  {
    href: 'https://t.me/example',
    label: 'Telegram',
    iconSrc: '/icons/social/telegram.png',
  },
  {
    href: 'https://max.ru/example',
    label: 'MAX',
    iconSrc: '/icons/social/max.png',
  },
  {
    href: 'https://vk.com/example',
    label: 'ВКонтакте',
    iconSrc: '/icons/social/vk.png',
  },
]
