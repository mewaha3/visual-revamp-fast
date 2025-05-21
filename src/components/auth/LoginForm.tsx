
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "กรุณากรอกอีเมลให้ถูกต้อง",
  }),
  password: z.string().min(1, {
    message: "กรุณากรอกรหัสผ่าน",
  }),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [debugMode, setDebugMode] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggleDebug = () => {
    setDebugMode(!debugMode);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Trying to login with email: ${values.email}`);
      const success = await login(values.email, values.password);

      if (success) {
        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับกลับมาอีกครั้ง",
        });
        navigate("/");
      } else {
        console.log("Login failed");
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        toast({
          title: "เข้าสู่ระบบล้มเหลว",
          description: "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  // Add test account for easy access
  const fillTestAccount = () => {
    form.setValue('email', 'somchai@example.com');
    form.setValue('password', 'password1');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อีเมล</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="อีเมล"
                    {...field}
                    className="pl-10"
                    type="email"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รหัสผ่าน</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="รหัสผ่าน"
                    {...field}
                    className="pl-10"
                  />
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-sm font-medium text-destructive">{error}</div>}

        <Button
          type="submit"
          className="w-full bg-fastlabor-600 hover:bg-fastlabor-700"
          disabled={isLoading}
        >
          {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>

        <div className="flex justify-between text-sm">
          <button 
            type="button" 
            onClick={fillTestAccount}
            className="text-fastlabor-600 hover:underline"
          >
            ลองใช้บัญชีทดสอบ
          </button>
          
          <button
            type="button"
            onClick={toggleDebug}
            className="text-gray-500 hover:underline"
          >
            {debugMode ? "ซ่อนข้อมูล Debug" : "แสดงข้อมูล Debug"}
          </button>
        </div>

        <div className="text-center text-sm">
          ยังไม่มีบัญชี?{" "}
          <a href="/register" className="text-fastlabor-600 hover:underline">
            สมัครสมาชิก
          </a>
        </div>
        
        {debugMode && (
          <div className="mt-4 p-3 bg-gray-50 border rounded text-xs">
            <h4 className="font-bold mb-1">Debug Info:</h4>
            <p>API Endpoint: <code>/api/users</code></p>
            <p>Server Status: <code id="server-status">Checking...</code></p>
            <p>Google Sheet ID: <code>1ZUWl-l3qa0lOpW0-lfsrYmiuOO-0s0Nmlecq5Pr26Mg</code></p>
            <p>Tab Name: <code>ชีต1</code></p>
            <button
              type="button"
              onClick={() => {
                fetch('/api')
                  .then(res => {
                    document.getElementById('server-status')!.innerText = res.ok ? 'Connected' : 'Error';
                    return res.json();
                  })
                  .then(data => console.log('Server response:', data))
                  .catch(err => {
                    document.getElementById('server-status')!.innerText = 'Failed to connect';
                    console.error('Server check error:', err);
                  });
              }}
              className="mt-2 px-2 py-1 bg-gray-200 text-xs rounded"
            >
              Check server
            </button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default LoginForm;
