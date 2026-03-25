import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight, ChevronRight, Menu, X, BookOpen, Feather, Users, Lightbulb } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { GridMotion } from "./ui/grid-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

function AnimatedGroup({
  children,
  className,
  variants,
}: {
  children: React.ReactNode
  className?: string
  variants?: {
    container?: Variants
    item?: Variants
  }
}) {
  const containerVariants = variants?.container || defaultContainerVariants
  const itemVariants = variants?.item || defaultItemVariants

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={cn(className)}>
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const menuItems = [
  { name: "Об авторе", href: "#author" },
  { name: "Сюжет", href: "#plot" },
  { name: "Герои", href: "#heroes" },
  { name: "Темы", href: "#themes" },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav data-state={menuState && "active"} className="fixed z-20 w-full px-2 group">
        <div
          className={cn(
            "mx-auto mt-1 max-w-4xl px-4 transition-all duration-300 lg:px-8",
            isScrolled && "bg-background/50 max-w-3xl rounded-2xl border backdrop-blur-lg lg:px-4",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-0">
            <div className="flex w-full justify-between lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </a>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Закрыть меню" : "Открыть меню"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  size="sm"
                  className={cn(
                    isScrolled
                      ? "lg:inline-flex bg-amber-700 hover:bg-amber-800"
                      : "hidden bg-amber-700 hover:bg-amber-800",
                  )}
                >
                  <span>Читать</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="bg-amber-700 rounded-lg p-2">
        <BookOpen className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold">Литпроект</span>
    </div>
  )
}

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-amber-200">
      {children}
    </div>
  </div>
)

export default function SoftwareDevelopmentWebsite() {
  const gridItems = [
    "https://cdn.poehali.dev/templates/landing-page/fluid-gradient.jpg",
    "https://cdn.poehali.dev/templates/landing-page/vr-experience.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-whiteboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/human-ai.jpg",
    "https://cdn.poehali.dev/templates/landing-page/digital-eye.jpg",
    "https://cdn.poehali.dev/templates/landing-page/robot.jpg",
    "https://cdn.poehali.dev/templates/landing-page/purple-flow.jpg",
    "https://cdn.poehali.dev/templates/landing-page/data-beam.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-keyboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fiber-optic.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fluid-gradient.jpg",
    "https://cdn.poehali.dev/templates/landing-page/vr-experience.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-whiteboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/human-ai.jpg",
    "https://cdn.poehali.dev/templates/landing-page/digital-eye.jpg",
    "https://cdn.poehali.dev/templates/landing-page/robot.jpg",
    "https://cdn.poehali.dev/templates/landing-page/purple-flow.jpg",
    "https://cdn.poehali.dev/templates/landing-page/data-beam.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-keyboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fiber-optic.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fluid-gradient.jpg",
    "https://cdn.poehali.dev/templates/landing-page/vr-experience.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-whiteboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/human-ai.jpg",
    "https://cdn.poehali.dev/templates/landing-page/digital-eye.jpg",
    "https://cdn.poehali.dev/templates/landing-page/robot.jpg",
  ]

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(30,60%,40%,.08)_0,hsla(30,60%,35%,.02)_50%,hsla(30,60%,30%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(30,60%,40%,.06)_0,hsla(30,60%,35%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        </div>

        {/* Hero */}
        <section>
          <div className="relative pt-24 md:pt-36">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <a
                    href="#author"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="text-foreground text-sm">Проект по литературе · 11 класс</span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </a>

                  <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                    Человек и система в{" "}
                    <span className="inline-block text-amber-600 text-6xl md:text-7xl xl:text-[5.25rem] font-semibold">
                      «Одном дне»
                    </span>
                  </h1>
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                    Александр Исаевич Солженицын · 1962 год
                  </p>
                  <p className="mx-auto mt-3 max-w-2xl text-balance text-base text-muted-foreground">
                    Один день из жизни заключённого — и целая эпоха через призму человеческого достоинства.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div key={1} className="bg-amber-700/10 rounded-[14px] border border-amber-200 p-0.5">
                    <Button size="lg" className="rounded-xl px-5 text-base bg-amber-700 hover:bg-amber-800">
                      <span className="text-nowrap">Читать анализ</span>
                    </Button>
                  </div>
                  <Button key={2} size="lg" variant="ghost" className="h-10.5 rounded-xl px-5 hover:text-amber-600">
                    <span className="text-nowrap">Главные герои</span>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-amber-200 p-4 shadow-lg shadow-amber-700/15 ring-1">
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 aspect-[15/8] relative rounded-2xl border border-amber-200 overflow-hidden">
                    <GridMotion items={gridItems} gradientColor="rgba(180, 120, 50, 0.1)" className="h-full w-full" />
                  </div>
                </div>
              </div>

              {/* Ключевые факты */}
              <section className="bg-background pb-16 pt-16 md:pb-32">
                <div className="group relative m-auto max-w-5xl px-6">
                  <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                    <a href="#themes" className="block text-sm duration-150 hover:opacity-75 text-amber-600">
                      <span>Перейти к темам произведения</span>
                      <ChevronRight className="ml-1 inline-block size-3" />
                    </a>
                  </div>
                  <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                    <div className="flex flex-col items-center text-center gap-2">
                      <span className="text-3xl font-bold text-amber-600">1959</span>
                      <span className="text-sm text-muted-foreground">год написания</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <span className="text-3xl font-bold text-amber-600">1962</span>
                      <span className="text-sm text-muted-foreground">год публикации</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <span className="text-3xl font-bold text-amber-600">1970</span>
                      <span className="text-sm text-muted-foreground">Нобелевская премия</span>
                    </div>
                  </div>
                </div>
              </section>
            </AnimatedGroup>
          </div>
        </section>

        {/* Об авторе */}
        <section id="author" className="bg-muted/50 py-16 md:py-32 dark:bg-transparent">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                Об <span className="text-amber-600">авторе</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Александр Исаевич Солженицын — русский писатель и мыслитель XX века, голос эпохи репрессий.
              </p>
            </div>
            <Card className="mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 border-amber-200 *:text-center md:mt-16 md:max-w-full md:grid-cols-3 md:divide-x md:divide-y-0">
              <div className="group shadow-zinc-950/5">
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <Feather className="size-6 text-amber-600" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium">Лауреат Нобелевской премии</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    В 1970 году получил Нобелевскую премию по литературе «за нравственную силу, с которой он продолжил традиции русской литературы».
                  </p>
                </CardContent>
              </div>

              <div className="group shadow-zinc-950/5">
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <BookOpen className="size-6 text-amber-600" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium">Свидетель эпохи</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Сам прошёл через сталинские лагеря с 1945 по 1953 год. Личный опыт лёг в основу всего его творчества, в том числе повести «Один день...».
                  </p>
                </CardContent>
              </div>

              <div className="group shadow-zinc-950/5">
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <Lightbulb className="size-6 text-amber-600" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium">Прорыв «оттепели»</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Повесть была опубликована в журнале «Новый мир» в 1962 году — одно из первых произведений, открыто говоривших о лагерной жизни.
                  </p>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>

        {/* Сюжет */}
        <section id="plot" className="py-16 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-6">
                  Краткий <span className="text-amber-600">сюжет</span>
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Произведение описывает один зимний день заключённого <strong>Ивана Денисовича Шухова</strong> — от подъёма до отбоя.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  На первый взгляд — обычный день: холод, изнурительный труд, борьба за лишнюю ложку баланды. Но именно через этот «один день» Солженицын раскрывает всю систему лагерной жизни.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  И несмотря на всё — в конце дня Шухов думает, что день выдался <em>почти счастливым</em>. Это и есть главный парадокс повести.
                </p>
              </div>
              <div className="bg-muted/50 rounded-2xl border border-amber-200 p-8">
                <blockquote className="text-lg italic text-muted-foreground leading-relaxed">
                  «Засыпал Шухов вполне удовлетворённый. На дню у него выдалось сегодня много удач...»
                </blockquote>
                <p className="mt-4 text-sm text-amber-600 font-medium">— А. И. Солженицын</p>
              </div>
            </div>
          </div>
        </section>

        {/* Главные герои */}
        <section id="heroes" className="bg-muted/50 py-16 md:py-32 dark:bg-transparent">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                Главные <span className="text-amber-600">герои</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Каждый герой — отдельная судьба, отдельный способ выжить в системе.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  name: "Иван Денисович Шухов",
                  role: "Главный герой",
                  desc: "Простой крестьянин. Сохраняет достоинство и внутренние принципы даже в нечеловеческих условиях.",
                },
                {
                  name: "Цезарь Маркович",
                  role: "Интеллигент",
                  desc: "Живёт чуть лучше остальных. Представитель другого социального слоя, не умеющего выживать физически.",
                },
                {
                  name: "Алёшка Баптист",
                  role: "Верующий",
                  desc: "Находит силу в вере. Его спокойствие и смирение — особый путь сохранения себя.",
                },
                {
                  name: "Тюрин",
                  role: "Бригадир",
                  desc: "Заботится о своей бригаде. Лидер, умеющий отстоять людей перед системой.",
                },
              ].map((hero) => (
                <Card key={hero.name} className="border-amber-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-700/10 rounded-full p-2">
                      <Users className="size-4 text-amber-600" />
                    </div>
                    <span className="text-xs text-amber-600 font-medium">{hero.role}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{hero.name}</h3>
                  <p className="text-sm text-muted-foreground">{hero.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Темы */}
        <section id="themes" className="py-16 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                Основные <span className="text-amber-600">темы</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Человеческое достоинство",
                  text: "Шухов сохраняет самоуважение через труд и честность. Он не унижается ради лишней пайки — в этом его победа над системой.",
                },
                {
                  title: "Выживание в нечеловеческих условиях",
                  text: "Каждый день — борьба за тепло, еду и жизнь. Но это не просто физическое выживание, а сохранение человека в человеке.",
                },
                {
                  title: "Система подавления личности",
                  text: "Лагерь — это механизм уничтожения индивидуальности. Номера вместо имён, приказы вместо выбора, страх вместо свободы.",
                },
                {
                  title: "Вера и надежда",
                  text: "Алёшка верит в Бога, Шухов верит в труд. Разная вера — но одна функция: дать смысл существованию.",
                },
              ].map((theme) => (
                <div key={theme.title} className="border border-amber-200 rounded-2xl p-6 bg-muted/20">
                  <h3 className="font-semibold text-lg mb-3 text-amber-600">{theme.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{theme.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Главная идея и вывод */}
        <section className="bg-muted/50 py-16 md:py-32 dark:bg-transparent">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-6">
                  Главная <span className="text-amber-600">идея</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Даже в самых тяжёлых условиях человек может сохранить свою человечность — если у него есть внутренние принципы и сила духа.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Шухов не борется с системой открыто. Он выживает с достоинством — и в этом его тихий подвиг.
                </p>
              </div>
              <div>
                <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-6">
                  Личное <span className="text-amber-600">мнение</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Это произведение произвело на меня сильное впечатление. Оно показывает, как важно оставаться человеком в любых обстоятельствах.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Особенно запомнился главный герой — человек без пафоса, без лишних слов, но с огромным внутренним достоинством.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Почему важно сегодня */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-6">
              Почему это важно <span className="text-amber-600">сегодня</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              Повесть напоминает о трагических страницах истории и учит ценить свободу, человеческое достоинство и моральные ценности.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Произведение Солженицына — это не просто рассказ о лагере, а глубокое размышление о человеке, его силе и способности выживать. Оно остаётся актуальным, пока существует несправедливость.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-amber-200">
        <div className="mx-auto max-w-7xl py-10 px-6 text-center">
          <Logo className="justify-center mb-4" />
          <p className="text-sm text-muted-foreground">
            Проект по литературе · «Один день Ивана Денисовича» · А. И. Солженицын
          </p>
          <p className="text-xs text-muted-foreground mt-2 opacity-60">Тема: Человек и система в произведении</p>
        </div>
      </footer>
    </>
  )
}
