<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users  = User::query()
            ->when($request['filters']['search'] != '', function (Builder $q) use ($request) {
                $q->where('name', 'like', '%' . $request['filters']['search'] . '%');
            })->paginate($request['per_page'] ?? 5);
        return UserResource::collection($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
        ]);
        $user = User::create($request->all());

        return new UserResource($user) ;
    }

    public function show(User $user)
    {
        //
    }

    public function update(Request $request, User $user)
    {

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable',
        ]);

        if ($request['password']) {
            $request['password'] = bcrypt($request->password);
            $user->update($request->all());
        } else {
            $user->update($request->except('password'));
        }

        return new UserResource($user) ;
    }

    public function destroy(User $user)
    {
        $user->delete();
    }
}
