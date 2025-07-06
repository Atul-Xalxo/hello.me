
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AgentGetOne } from "../../types";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?:()=>void;
    onCancel?:()=>void;
    initialValues?:AgentGetOne;
};

export const AgentForm=({
    onSuccess,
    onCancel,
    initialValues,
}:AgentFormProps)=>{
    const trpc=useTRPC();
    const router=useRouter();
    const queryClient=useQueryClient();

    // const createAgent=useMutation({
    //     trpc.agents.create.mutationOptions({
    //         onSuccess:async()=>{
    //             await queryClient.invalidateQueries(
    //                 trpc.agents.getMany.queryOptions(),
    //             );
    //             if(initialValues?.id){
    //                 await queryClient.invalidateQueries(
    //                     trpc.agents.getOne.queryOptions({id:initialValues.id}),
    //                 );
    //             }
    //             onSuccess?.();
    //         },
    //         onError:(error)=>{
    //             toast.error(error.message);

    //             //TODO:Check if error code is "FORBIDDEN",redirect to "/upgrade"
    //         },
    //     }),
    // });
console.log("trpc.agents.create:", trpc.agents.create);
console.log("typeof trpc.agents.create:", typeof trpc.agents.create);


    const createAgent = useMutation({
  mutationFn: async (input) => {
    return await trpc.agents.create(input); // or .mutate(input) if required
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries(["agents.getMany"]);

    if (initialValues?.id) {
      await queryClient.invalidateQueries(["agents.getOne", { id: initialValues.id }]);
    }

    onSuccess?.();
  },
  onError: (error) => {
    toast.error(error.message);
    // TODO: Check if error.code === "FORBIDDEN", redirect to /upgrade
  },
});






    const form=useForm<z.infer<typeof agentsInsertSchema>>({
        resolver:zodResolver(agentsInsertSchema),
        defaultValues:{
            name:initialValues?.name?? "",
            instructions:initialValues?.instructions?? "",
        },
    });

    const isEdit=!!initialValues?.id;
    const isPending=createAgent.isPending ;

    const onSubmit=(values:z.infer<typeof agentsInsertSchema>)=>{
        if(isEdit){
            console.log("TODO:updateAgent")
        }else{
            createAgent.mutate(values);
        }
    };

    return(
        <Form{...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar
                 seed={form.watch("name")}
                 variant="botttsNeutral"
                  className="size-15 p-1"
                 />
                 <FormField
                 name="name"
                 control={form.control}
                 render={({field})=>(
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g-OOPS Mentor"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                 )}/>
                 <FormField
                 name="instructions"
                 control={form.control}
                 render={({field})=>(
                    <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea 
                            {...field} 
                            placeholder="You are an OOPS Mentor who can help in learn OOPS Concept and clear my doubts."/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                 )}/>

                <div className="flex justify-between gap-x-2">
                 {
                    onCancel &&(
                        <Button
                        variant="ghost"
                        disabled={isPending}
                        type="button"
                        onClick={()=>onCancel()}
                        >
                            Cancel
                        </Button>
                    )
                 }
                 <Button disabled={isPending} type="submit">
                    {
                       isEdit?"Update":"Create" 
                    }
                 </Button>
                </div> 
            </form>
        </Form>
    )
}