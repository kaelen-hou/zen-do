'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Languages will be defined inside component to use translations

export function LanguageSwitcher() {
  const t = useTranslations('settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'zh', name: t('languageChinese'), flag: '🇨🇳' },
    { code: 'en', name: t('languageEnglish'), flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2">
          <Languages className="h-4 w-4" />
          <span className="text-sm">{currentLanguage?.flag}</span>
          <span className="hidden text-sm sm:inline">
            {currentLanguage?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {languages.map(language => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex cursor-pointer items-center gap-2 ${
              locale === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-sm">{language.flag}</span>
            <span className="text-sm">{language.name}</span>
            {locale === language.code && (
              <span className="text-muted-foreground ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
