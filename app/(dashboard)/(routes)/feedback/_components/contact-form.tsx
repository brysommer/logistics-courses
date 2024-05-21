"use client"

import * as z from "zod";

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";




interface ContactFormProps {
    serviceId: string;
    templateId: string;
    publicKey: string;
}

const formSchema = z.object({
  user_name: z.string().min(1, {
    message: "Імя необхідне",
  }),
  user_email: z.string().min(1, {
    message: "Пошта необхідна",
  }),
  message: z.string().min(1, {
    message: "Пошта необхідна",
  }),
});


const ContactForm = ({
    serviceId,
    templateId,
    publicKey
}: ContactFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });

    const { isValid } = form.formState;   

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stateMessage, setStateMessage] = useState<string | null>(null);

    const sendEmail = (e: any) => {
      e.persist();
      e.preventDefault();
      setIsSubmitting(true);
      emailjs
        .sendForm(
            serviceId,
            templateId,
            e.target,
            publicKey
        )
        .then(
          (result) => {
            setStateMessage('Message sent!');
            setIsSubmitting(false);
            setTimeout(() => {
              setStateMessage(null);
            }, 5000); // hide message after 5 seconds
          },
          (error) => {
            console.log(error)
            setStateMessage('Something went wrong, please try again later');
            setIsSubmitting(false);
            setTimeout(() => {
              setStateMessage(null);
            }, 5000); // hide message after 5 seconds
          }
        );
      
      // Clears the form after sending the email
      e.target.reset();
    };
    return (
      <div className="px-6 flex items-center gap-x-2">
            <div className="mt-10 mx-5 border bg-slate-100 rounded-md p-10 ">
              <div>
                <h1 className="text-2xl font-medium">
                        Зворотній звязок
                </h1>
              </div>
              <Form {...form}>
                <form
                    onSubmit={sendEmail}
                    className="space-y-4 mt-4"
                >
                    <FormField
                        control={form.control}
                        name="user_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                      disabled={isSubmitting}
                                      placeholder="Ваше імя"
                                      {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="user_email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                      disabled={isSubmitting}
                                      placeholder="Ваша електронна пошта"
                                      {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        disabled={isSubmitting}
                                        placeholder="Задайте своє питання"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Відправити
                            </Button>
                        </div>
                    </form>
                    {stateMessage && <p>{stateMessage}</p>}
                </Form>
            </div>

        </div>
    );
  };
  export default ContactForm;