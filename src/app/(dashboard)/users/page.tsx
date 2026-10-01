import type { Metadata } from "next";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PLATFORM_LIST } from "@/lib/platforms";
import { formatDateUtc, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { mockUsers } from "@/lib/data/mockData";

export const metadata: Metadata = {
  title: "Users",
  description: "Connected accounts and their reach on each platform.",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          {formatNumber(mockUsers.length)} connected accounts.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockUsers.map((user) => (
          <li key={user.id}>
            <Card className="h-full">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-4">
                  {/* next/image via the shared Avatar, rather than a raw <img>
                      with an eslint-disable and no intrinsic size. */}
                  <Avatar src={user.avatar} name={user.name} size={56} />
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">{user.name}</h2>
                    <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>

                <p className="text-sm">{user.bio}</p>

                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {PLATFORM_LIST.filter((platform) => user.platforms[platform.id]).map(
                    (platform) => {
                      const Icon = platform.icon;
                      return (
                        <li
                          key={platform.id}
                          className={cn("flex items-center gap-1 text-sm", platform.textClass)}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">{platform.label}: </span>
                          <span>{user.platforms[platform.id]}</span>
                        </li>
                      );
                    },
                  )}
                </ul>

                <p className="flex justify-between border-t pt-3 text-sm text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground">
                      {formatNumber(user.followers)}
                    </span>{" "}
                    followers
                  </span>
                  <span>
                    <span className="font-medium text-foreground">
                      {formatNumber(user.following)}
                    </span>{" "}
                    following
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Joined {formatDateUtc(user.joinedDate)}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
