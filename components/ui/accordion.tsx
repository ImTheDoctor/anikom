import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

// House styling over the Base UI primitive (generated via
// `pnpm dlx shadcn@latest add accordion`, adapted with intent): hairline
// rows, serif questions, editorial hover underline, and a rotating chevron.
// The panel animates its height through Base UI's --accordion-panel-height
// variable — a pure CSS transition that re-targets mid-flight (interruptible)
// and is disabled under prefers-reduced-motion.
function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b border-border", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-start justify-between gap-6 py-5 text-left underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          aria-hidden="true"
          data-slot="accordion-chevron"
          className="mt-1 size-5 shrink-0"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      keepMounted
      data-slot="accordion-content"
      className="overflow-hidden transition-[height,opacity] duration-300 ease-out motion-reduce:transition-none data-closed:h-0 data-closed:opacity-0 data-open:h-(--accordion-panel-height) data-open:opacity-100"
      {...props}
    >
      <div
        className={cn(
          "min-w-0 pb-5 pr-10 text-sm leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
